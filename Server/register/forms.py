#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from package.form import Form, forms


# 验证码表单
class VerifyCodeForm(Form):
    tel = forms.CharField(min_length=11,
                          max_length=11,
                          required=True,
                          error_messages={
                              'required': '你没有填写【手机号码】',
                              'min_length': '【手机号码】长度错误',
                              'max_length': '【手机号码】长度错误',
                          }
                          )


# 用户注册
class RegisterForm(VerifyCodeForm):
    username = forms.CharField(label='username',
                               min_length=2,
                               max_length=20,
                               required=True,
                               error_messages={
                                   'required': '你没有填写【用户名】',
                                   'max_length': '【用户名】长度需要在2~20位之间',
                                   'min_length': '【用户名】长度需要在2~20位之间'
                               }
                               )
    password = forms.CharField(label='password',
                               min_length=8,
                               max_length=40,
                               required=True,
                               error_messages={
                                   'required': '你没有填写【密码】',
                                   'max_length': '【密码】长度需要在8~40位之间',
                                   'min_length': '【密码】长度需要在8~40位之间'
                               }
                               )
    vcode = forms.CharField(label='vcode',
                            min_length=4,
                            max_length=4,
                            required=True,
                            error_messages={
                                'required': '你没有填写【验证码】',
                                'min_length': '【验证码】长度错误',
                                'max_length': '【验证码】长度错误'
                            }
                            )
    usertype = forms.CharField(label='usertype',
                               min_length=2,
                               max_length=2,
                               required=True,
                               error_messages={
                                   'required': '你没有选择【用户类型】',
                                   'min_length': '【用户类型】错误',
                                   'max_length': '【用户类型】错误'
                               }
                               )
