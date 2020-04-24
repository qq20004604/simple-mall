import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit, pub_limit, login_limit, order_taker_limit
from package.response_data import get_res_json
from .forms import CreateOrderForm, GetOrderListForm, GetOrderDetailForm, TakerOrderForm, SetTakerOrderForm
from .models import Order
from register.models import User
from django.db.models import Q
import math


# Create your views here.
@my_csrf_decorator()
@pub_limit
@post_limit
def create(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = CreateOrderForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())
    # 拿取数据
    pub_id = request.session.get('id')
    title = uf.data['title']
    content = uf.data['content']
    tag = uf.data['tag']
    price = uf.data['price']
    data = Order.objects.create(
        pub_user_id=pub_id,
        title=title,
        content=content,
        tag=tag,
        price=price
    )
    # 设置该订单为已发送
    data.set_status_published()
    print(data)
    data.save()

    return get_res_json(code=200, msg='订单发布成功', data={
        'id': data.id
    })


# 生成需要的返回数据
def get_order_list_all_item(item, key):
    # 发布人
    if key == 'pub_username':
        return User.objects.filter(id=item.pub_user_id)[0].username
    # 候选人
    if key == 'candidate_order_taker_username':
        candidate_order_taker = item.candidate_order_taker
        # 长度为0，说明没有候选人
        if len(candidate_order_taker) == 0:
            return ''
        taker_id_list = candidate_order_taker.split(',')
        cnname_list = [User.objects.filter(id=user_id)[0].username for user_id in taker_id_list]
        return ','.join(cnname_list)
    # 接单人姓名
    if key == 'order_taker_username':
        order_taker = item.order_taker
        # 长度为0，说明没有接单人
        if len(order_taker) == 0:
            return ''
        # 否则返回该接单人的姓名
        return User.objects.filter(id=item.order_taker)[0].username


# 返回订单列表（全部）
@my_csrf_decorator()
@post_limit
def get_order_list_all(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = GetOrderListForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    page_num = uf.data['page_num'] or 1
    page_size = 20

    # 拿取数据
    data = Order.objects.order_by('-id').filter(Q(order_status='01') | Q(order_status='10'))
    total = data.count()
    total_page = math.ceil(total / page_size)
    # 拿取分页后的数据
    pagination_data = data[page_size * (page_num - 1):page_num * page_size]

    # 生成指定字段。可以参考 https://stackoverflow.com/questions/7811556/how-do-i-convert-a-django-queryset-into-list-of-dicts
    list = [
        {
            "id": item.id,  # 订单id
            "create_date": item.create_date.strftime('%Y-%m-%d %H:%M:%S') if item.create_date else '',  # 订单创建时间
            "pub_user_id": item.pub_user_id,  # 订单发布人的id
            "pub_username": get_order_list_all_item(item, 'pub_username'),  # 订单发布人的username
            "title": item.title,
            "content": item.content[0:100],  # 订单描述（只取前100个字作为简略）
            "tag": item.tag,  # 订单标签，多个标签以逗号分隔
            "price": item.price,  # 价格
            "candidate_order_taker": item.candidate_order_taker,  # 候选接单人
            "candidate_order_taker_username": get_order_list_all_item(item, 'candidate_order_taker_username'),  # 候选接单人
            "order_status_cn": item.get_order_status_cn(),  # 订单状态的文字内容
            "order_status": item.order_status,  # 订单状态的状态码
        } for item in pagination_data
    ]
    print(data)
    return get_res_json(code=200, msg='success', data={
        "current": page_num,  # 当前数据是第几页，0条数据这里也是1
        "total_page": total_page,  # 一共有多少页（10 页）
        "page_size": page_size,  # 每页多少条（20条）
        "total": total,  # 一共有多少条数据（190条）
        "list": list
    })


# 返回订单详情（公共）
@my_csrf_decorator()
@post_limit
def get_order_detail_public(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = GetOrderDetailForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    order_id = uf.data['id']
    # 条件筛选，id符合，状态也得符合（禁止查询到隐私数据——即那些未公开状态不是01或10的订单）
    data = Order.objects.filter(id=order_id).filter(Q(order_status='01') | Q(order_status='10'))
    if len(data) == 0:
        return get_res_json(code=0, msg='id错误，无法查询到对应的数据')

    # 拿到该条数据
    item = data[0]
    # 拼装
    result = {
        "id": item.id,  # 订单id
        "create_date": item.create_date.strftime('%Y-%m-%d %H:%M:%S') if item.create_date else '',  # 订单创建时间
        "pub_user_id": item.pub_user_id,  # 订单发布人的id
        "pub_username": get_order_list_all_item(item, 'pub_username'),  # 订单发布人的username
        "title": item.title,
        "content": item.content[0:100],  # 订单描述（只取前100个字作为简略）
        "tag": item.tag,  # 订单标签，多个标签以逗号分隔
        "price": item.price,  # 价格
        "candidate_order_taker": item.candidate_order_taker,  # 候选接单人
        "candidate_order_taker_username": get_order_list_all_item(item, 'candidate_order_taker_username'),  # 候选接单人
        "order_status_cn": item.get_order_status_cn(),  # 订单状态的文字内容
        "order_status": item.order_status,  # 订单状态的状态码
    }

    return get_res_json(code=200, data=result)


# 返回订单列表（个人，如发布者、候选接单人、接单人）
@my_csrf_decorator()
@post_limit
@login_limit
def get_order_list_self(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = GetOrderListForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    page_num = uf.data['page_num'] or 1
    page_size = 20
    # 拿取用户 id
    user_id = request.session.get('id')

    # 拿取数据
    # 筛选条件1：创建人
    # 条件2：接单人
    # 条件3：他是候选人，具体方式如下：【此人id】【（开始）此人id,】【,此人id,】【,此人id（结尾）】共计四种情况
    data = Order.objects.order_by('-id').filter(
        Q(pub_user_id=user_id) | Q(order_taker=user_id) | Q(candidate_order_taker=user_id) | Q(
            candidate_order_taker__startswith='%s,' % user_id) | Q(
            candidate_order_taker__contains=',%s,' % user_id) | Q(
            candidate_order_taker__endswith=',%s' % user_id))
    total = data.count()
    total_page = math.ceil(total / page_size)
    # 拿取分页后的数据
    pagination_data = data[page_size * (page_num - 1):page_num * page_size]

    # 生成指定字段。可以参考 https://stackoverflow.com/questions/7811556/how-do-i-convert-a-django-queryset-into-list-of-dicts
    list = [
        {
            "id": item.id,  # 订单id
            "create_date": item.create_date.strftime('%Y-%m-%d %H:%M:%S') if item.create_date else '',  # 订单创建时间
            "pub_user_id": item.pub_user_id,  # 订单发布人的id
            "pub_username": get_order_list_all_item(item, 'pub_username'),  # 订单发布人的username
            "title": item.title,
            "content": item.content[0:100],  # 订单描述（只取前100个字作为简略）
            "tag": item.tag,  # 订单标签，多个标签以逗号分隔
            "price": item.price,  # 价格
            "candidate_order_taker": item.candidate_order_taker,  # 候选接单人
            "candidate_order_taker_username": get_order_list_all_item(item, 'candidate_order_taker_username'),  # 候选接单人
            "order_status_cn": item.get_order_status_cn(),  # 订单状态的文字内容
            "order_status": item.order_status,  # 订单状态的状态码
            "order_taker": item.order_taker,  # 订单接单人id
            "order_taker_username": get_order_list_all_item(item, 'order_taker_username'),  # 订单接单人 username
            "order_set_taker_date": item.order_set_taker_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_set_taker_date else '',  # 选定接单人时间
            "order_begin_doing_date": item.order_begin_doing_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_begin_doing_date else '',  # 接单方确认开始时间
            "order_done_by_taker_date": item.order_done_by_taker_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_done_by_taker_date else '',  # 接单方确认完成时间
            "order_done_by_pub_date": item.order_done_by_pub_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_done_by_pub_date else '',  # 发单方确认完成时间
            "order_scored_by_taker_date": item.order_scored_by_taker_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_scored_by_taker_date else '',  # 接单方评价时间
            "order_scored_by_pub_date": item.order_scored_by_pub_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_scored_by_pub_date else '',  # 发单方评价时间
            # 接单方取消订单时间
            "order_canceled_by_taker_date": item.order_canceled_by_taker_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_canceled_by_taker_date else '',
            "order_canceled_by_pub_date": item.order_canceled_by_pub_date.strftime(
                '%Y-%m-%d %H:%M:%S') if item.order_canceled_by_pub_date else '',  # 发单方取消订单时间
            "pub_score_taker": item.pub_score_taker,  # 发单方给接单方打分，1~5分打分，5分好评
            "pub_score_taker_des": item.pub_score_taker_des,  # 发单方给接单方的评价文字内容
            "taker_score_pub": item.taker_score_pub,  # 接单方给发单方打分，1~5分打分，5分好评
            "taker_score_pub_des": item.taker_score_pub_des,  # 接单方给发单方的评价文字内容
        } for item in pagination_data
    ]
    print(data)
    return get_res_json(code=200, msg='success', data={
        "current": page_num,  # 当前数据是第几页，0条数据这里也是1
        "total_page": total_page,  # 一共有多少页（10 页）
        "page_size": page_size,  # 每页多少条（20条）
        "total": total,  # 一共有多少条数据（190条）
        "list": list
    })


# 返回订单详情（个人）
@my_csrf_decorator()
@post_limit
def get_order_detail_private(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = GetOrderDetailForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    order_id = uf.data['id']
    # 拿取用户 id
    user_id = request.session.get('id')
    # 条件筛选，id符合，权限也得符合（禁止查询到隐私数据——即那些未公开状态不是01或10的订单）
    data = Order.objects.filter(id=order_id).filter(
        Q(pub_user_id=user_id) | Q(order_taker=user_id) | Q(candidate_order_taker=user_id) | Q(
            candidate_order_taker__startswith='%s,' % user_id) | Q(
            candidate_order_taker__contains=',%s,' % user_id) | Q(
            candidate_order_taker__endswith=',%s' % user_id))

    if len(data) == 0:
        return get_res_json(code=0, msg='id错误，无法查询到对应的数据')

    # 拿到该条数据
    item = data[0]
    # 拼装
    result = {
        "id": item.id,  # 订单id
        "create_date": item.create_date.strftime('%Y-%m-%d %H:%M:%S') if item.create_date else '',  # 订单创建时间
        "pub_user_id": item.pub_user_id,  # 订单发布人的id
        "pub_username": get_order_list_all_item(item, 'pub_username'),  # 订单发布人的username
        "title": item.title,
        "content": item.content[0:100],  # 订单描述（只取前100个字作为简略）
        "tag": item.tag,  # 订单标签，多个标签以逗号分隔
        "price": item.price,  # 价格
        "candidate_order_taker": item.candidate_order_taker,  # 候选接单人
        "candidate_order_taker_username": get_order_list_all_item(item, 'candidate_order_taker_username'),  # 候选接单人
        "order_status_cn": item.get_order_status_cn(),  # 订单状态的文字内容
        "order_status": item.order_status,  # 订单状态的状态码
        "order_taker": item.order_taker,  # 订单接单人id
        "order_taker_username": get_order_list_all_item(item, 'order_taker_username'),  # 订单接单人 username
        "order_set_taker_date": item.order_set_taker_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_set_taker_date else '',  # 选定接单人时间
        "order_begin_doing_date": item.order_begin_doing_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_begin_doing_date else '',  # 接单方确认开始时间
        "order_done_by_taker_date": item.order_done_by_taker_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_done_by_taker_date else '',  # 接单方确认完成时间
        "order_done_by_pub_date": item.order_done_by_pub_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_done_by_pub_date else '',  # 发单方确认完成时间
        "order_scored_by_taker_date": item.order_scored_by_taker_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_scored_by_taker_date else '',  # 接单方评价时间
        "order_scored_by_pub_date": item.order_scored_by_pub_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_scored_by_pub_date else '',  # 发单方评价时间
        # 接单方取消订单时间
        "order_canceled_by_taker_date": item.order_canceled_by_taker_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_canceled_by_taker_date else '',
        "order_canceled_by_pub_date": item.order_canceled_by_pub_date.strftime(
            '%Y-%m-%d %H:%M:%S') if item.order_canceled_by_pub_date else '',  # 发单方取消订单时间
        "pub_score_taker": item.pub_score_taker,  # 发单方给接单方打分，1~5分打分，5分好评
        "pub_score_taker_des": item.pub_score_taker_des,  # 发单方给接单方的评价文字内容
        "taker_score_pub": item.taker_score_pub,  # 接单方给发单方打分，1~5分打分，5分好评
        "taker_score_pub_des": item.taker_score_pub_des,  # 接单方给发单方的评价文字内容
    }

    return get_res_json(code=200, data=result)


# 接单
@my_csrf_decorator()
@post_limit
@order_taker_limit
def take_order(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = TakerOrderForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    order_id = uf.data['id']
    # 拿取用户 id
    user_id = request.session.get('id')
    # 先拿取数据
    order_data = Order.objects.filter(id=order_id)
    if len(order_data) == 0:
        return get_res_json(code=0, msg='订单错误，无法找到对应的订单')
    result = order_data[0].set_candidate_order_taker(user_id)
    # 如果正常，则返回True
    if result is True:
        order_data[0].save()
        return get_res_json(code=200, data={
            'id': order_data[0].id
        })
    else:
        return get_res_json(code=0, msg=result)


# 选择接单人
@my_csrf_decorator()
@post_limit
@pub_limit
def set_take_order(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = SetTakerOrderForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    order_id = uf.data['order_id']
    user_id = uf.data['user_id']
    # 拿取用户 id
    pub_id = request.session.get('id')
    # 先拿取数据
    order_data = Order.objects.filter(id=order_id, pub_user_id=pub_id)
    if len(order_data) == 0:
        return get_res_json(code=0, msg='订单错误，无法找到对应的订单')
    # 设置订单候选人
    result = order_data[0].set_order_taker(user_id)
    # 如果正常，则返回True
    if result is True:
        order_data[0].save()
        return get_res_json(code=200)
    else:
        return get_res_json(code=0, msg=result)


# 开始订单
@my_csrf_decorator()
@post_limit
@order_taker_limit
def order_begin(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = TakerOrderForm(post_data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    order_id = uf.data['id']
    # 拿取用户 id
    taker_id = request.session.get('id')
    # 先拿取数据
    order_data = Order.objects.filter(id=order_id)
    if len(order_data) == 0:
        return get_res_json(code=0, msg='订单错误，无法找到对应的订单')
    # 设置订单候选人
    result = order_data[0].set_order_doing(taker_id)
    # 如果正常，则返回True
    if result is True:
        order_data[0].save()
        return get_res_json(code=200)
    else:
        return get_res_json(code=0, msg=result)
