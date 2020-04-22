import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit, pub_limit
from package.response_data import get_res_json
from .forms import CreateOrderForm
from .models import Order


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
