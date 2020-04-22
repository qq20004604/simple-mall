import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit
from package.response_data import get_res_json
from .forms import VerifyCodeForm, RegisterForm
from package.send_sms import send_vcode_sms
from register.models import TelVerifyCode, User
from configuration.variable import SMS_SEND_INTERVAL_TIME
from package.session_manage import set_user_session


# Create your views here.
@my_csrf_decorator()
@post_limit
def send_verify_code(request):
    # 加载数据
    data = json.loads(request.body)
    # 表单校验
    uf = VerifyCodeForm(data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    # 验证码发送
    # 1、判断数据库里有没有该号码发送的记录（并且该记录已经大于最大发送间隔），同号码的验证码————若有则返回报错信息；
    # 2、生成一条 手机号码 + 验证码 + 当前时间 的数据，插入数据库
    # 3、发送验证码————发送失败则返回提示信息
    # 4、发送成功，返回成功的提示信息
    # 先手机号码
    tel = uf.data['tel']
    # 1、倒叙查找查找号码符合的最新的一条数据
    filter_resuilt = TelVerifyCode.objects.order_by('-id').filter(tel=tel)[:1]
    # 查到了，则查看是否小于最大间隔
    if len(filter_resuilt) > 0:
        if filter_resuilt[0].over_interval() is False:
            # 此时小于最大间隔
            return get_res_json(code=0, msg='每次发送验证码短信的时间间隔是 %s 秒' % SMS_SEND_INTERVAL_TIME)

    # 2、生成一条数据
    insert_data = TelVerifyCode.objects.create(tel=tel)
    # 拿到验证码
    vcode = insert_data.vcode
    # 插入到数据库
    insert_data.save()
    # 3、发送验证码。
    # 成功返回True，失败返回错误提示信息
    send_result = send_vcode_sms(tel, vcode)

    if send_result is True:
        # 成功
        return get_res_json(code=200, msg='验证码发送成功')
    else:
        # 失败，返回错误提示信息
        return get_res_json(code=0, msg=send_result)


@my_csrf_decorator()
@post_limit
def reg(request):
    # 加载数据
    data = json.loads(request.body)
    # 表单校验
    uf = RegisterForm(data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    # 1、以手机号码和验证码作为条件，在 TelVerifyCode 表里查询是否有数据————没数据则返回报错信息，提示验证码错误
    # 2、如果有数据，则检查验证码是否过期————过期则返回报错信息
    # 3、分别以手机号码、用户名 为条件，在 User 表里查询是否有数据————有数据说明冲突，返回提示信息
    # 4、将手机号码、用户名、密码，插入 User 表

    # 忽略验证码（测试时改为True，正常是False）
    IGNORE_VCODE = False

    # 1、加载数据
    tel = uf.data['tel']
    username = uf.data['username']
    vcode = uf.data['vcode']
    password = uf.data['password']
    usertype = uf.data['usertype']
    # 查询最新的一条数据
    verify_info = TelVerifyCode.objects.order_by('-id').filter(tel=tel, vcode=vcode)[:1]
    # 如果是 False，则跳过验证码（这个值要有，但可以随便输4位）
    if IGNORE_VCODE is False:
        if len(verify_info) == 0:
            # 不存在
            return get_res_json(code=0, msg='验证码错误或验证码过期')
        # 2、如果有数据，则查询该数据是否过期
        if verify_info[0].was_outdated() is True:
            # 过期
            return get_res_json(code=0, msg='验证码错误或验证码过期')
    # 3、查重
    if len(User.objects.filter(username=username)) > 0:
        # 用户名重复
        return get_res_json(code=0, msg='用户名重复，请换一个用户名')
    if len(User.objects.filter(tel=tel)) > 0:
        # 手机号码重复
        return get_res_json(code=0, msg='手机号码重复，请换一个手机号码')
    # 插入表
    new_user = User.objects.create(username=username, tel=tel, password=password, usertype=usertype)
    new_user.save()
    # 同时设置为登录
    set_user_session(request, new_user)
    return get_res_json(code=200, msg='注册成功', data={
        'username': username,
        'usertype': usertype
    })
