from django.shortcuts import render
from django.http import HttpResponse
import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit
from package.response_data import get_res_json
from .forms import LoginForm
from register.models import User
from django.contrib.auth import authenticate, login


# Create your views here.
@my_csrf_decorator()
@post_limit
def login(request):
    # 加载数据
    data = json.loads(request.body)
    # 表单校验
    uf = LoginForm(data)
    # 数据是否合法
    if uf.is_valid() is False:
        # 返回错误信息
        return get_res_json(code=0, msg=uf.get_form_error_msg())

    # 1、以手机号码和密码作为条件，在 User 表里查询是否有数据————没数据则返回报错信息，提示该用户不存在/密码错误
    # 2、存在，修改最后登录时间
    # 3、配置 session

    # 忽略图片验证码（测试时改为True，正常是False）
    IGNORE_IMG_CODE = True

    # 1、加载数据
    tel = uf.data['tel']
    # imgcode = uf.data['imgcode']
    password = uf.data['password']
    search_result = User.objects.filter(tel=tel, password=password)
    # 3、查重
    if len(search_result) == 0:
        # 用户名重复
        return get_res_json(code=0, msg='该用户不存在/密码错误')
    # 插入表
    search_result[0].set_last_login()
    search_result[0].save()
    # 同时设置为登录
    request.session['id'] = search_result[0].id
    request.session['username'] = search_result[0].username
    request.session['last_login_timestamp'] = search_result[0].last_login.timestamp()
    return get_res_json(code=200, msg='登录成功', data={'username': search_result[0].username})
