#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from package.form import Form, forms


# 用户登录
class LoginForm(Form):
    tel = forms.CharField(min_length=11,
                          max_length=11,
                          required=True,
                          error_messages={
                              'required': '你没有填写【手机号码】',
                              'min_length': '【手机号码】长度错误',
                              'max_length': '【手机号码】长度错误',
                          }
                          )
    password = forms.CharField(label='password',
                               min_length=8,
                               max_length=20,
                               required=True,
                               error_messages={
                                   'required': '你没有填写【密码】',
                                   'max_length': '【密码】长度需要在8~40位之间',
                                   'min_length': '【密码】长度需要在8~40位之间'
                               }
                               )
