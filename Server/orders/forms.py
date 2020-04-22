#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from package.form import Form, forms
from django.core.validators import RegexValidator


# 验证码表单
class CreateOrderForm(Form):
    title = forms.CharField(min_length=4,
                            max_length=40,
                            required=True,
                            error_messages={
                                'required': '你没有填写【订单名称】',
                                'min_length': '【订单名称】长度应该在4~40字之间',
                                'max_length': '【订单名称】长度应该在4~40字之间',
                            }
                            )
    content = forms.CharField(min_length=1,
                              max_length=2000,
                              required=True,
                              error_messages={
                                  'required': '你没有填写【订单描述】',
                                  'min_length': '【订单描述】长度应该在1~2000字之间',
                                  'max_length': '【订单描述】长度应该在1~2000字之间',
                              }
                              )
    tag = forms.CharField(max_length=50,
                          required=False,
                          validators=[
                              RegexValidator(r'[^,]{8,}', '单个标签最多只能有8个字')
                          ],
                          error_messages={
                              'max_length': '【订单标签】长度应不超过40字',
                          }
                          )

    price = forms.CharField(max_length=20,
                            error_messages={
                                'required': '你没有填写【订单预期价格】',
                                'max_length': '【订单预期价格】长度应少于20个字',
                            }
                            )
