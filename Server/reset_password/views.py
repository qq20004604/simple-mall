import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit
from package.response_data import get_res_json
from .forms import ResetVerifyCodeForm
from package.send_sms import send_vcode_sms
from register.models import TelVerifyCode
from configuration.variable import SMS_SEND_INTERVAL_TIME


# Create your views here.
# 发送重置密码验证码
@my_csrf_decorator()
@post_limit
def send_verify_code(request):
    # 加载数据
    data = json.loads(request.body)
    # 表单校验
    uf = ResetVerifyCodeForm(data)
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
    # insert_data.save()
    # 3、发送验证码。
    # 成功返回True，失败返回错误提示信息
    # send_result = send_vcode_sms(tel, vcode)
    send_result = True

    if send_result is True:
        # 成功
        return get_res_json(code=200, msg='验证码发送成功1')
    else:
        # 失败，返回错误提示信息
        return get_res_json(code=0, msg=send_result)
