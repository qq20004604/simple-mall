#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from package.form import Form, forms


# 验证码表单
class ResetVerifyCodeForm(Form):
    tel = forms.CharField(min_length=11,
                          max_length=11,
                          required=True,
                          error_messages={
                              'required': '你没有填写【手机号码】',
                              'min_length': '【手机号码】长度错误',
                              'max_length': '【手机号码】长度错误',
                          }
                          )
