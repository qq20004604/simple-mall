import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit, pub_limit
from package.response_data import get_res_json
from .forms import CreateOrderForm, GetOrderListByAllForm, GetOrderDetailPublicForm
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


# 返回订单列表（全部）
@my_csrf_decorator()
@post_limit
def get_order_list_all(request):
    # 加载数据
    post_data = json.loads(request.body)
    # 表单校验
    uf = GetOrderListByAllForm(post_data)
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

    # 生成指定字段。可以参考 https://stackoverflow.com/questions/7811556/how-do-i-convert-a-django-queryset-into-list-of-dicts
    list = [
        {
            "id": item.id,  # 订单id
            "create_date": item.create_date.strftime('%Y-%m-%d %H:%M:%S'),  # 订单创建时间
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
        } for item in data
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
    uf = GetOrderDetailPublicForm(post_data)
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
        "create_date": item.create_date.strftime('%Y-%m-%d %H:%M:%S'),  # 订单创建时间
        "pub_user_id": item.pub_user_id,  # 订单发布人的id
        "pub_username": get_order_list_all_item(item, 'pub_username'),  # 订单发布人的username
        "title": item.title,
        "content": item.content,  # 订单描述（只取前100个字作为简略）
        "tag": item.tag,  # 订单标签，多个标签以逗号分隔
        "price": item.price,  # 订单价格
        "candidate_order_taker": item.candidate_order_taker,  # 候选接单人
        "candidate_order_taker_username": get_order_list_all_item(item, 'candidate_order_taker_username'),  # 候选接单人
        "order_status_cn": item.get_order_status_cn(),  # 订单状态的文字内容
        "order_status": item.order_status,  # 订单状态的状态码
    }

    return get_res_json(code=200, data=result)
