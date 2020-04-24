#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from package.form import Form, forms
from django.core.validators import RegexValidator


# 创建订单
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


# 获取订单列表（默认订单列表，分页查询）
class GetOrderListForm(Form):
    # 查询第几页，第1页的则传1
    page_num = forms.IntegerField(min_value=1,
                                  max_value=10000,
                                  required=True,
                                  error_messages={
                                      'required': '你没有填写【页码】',
                                      'min_value': '【页码】数值错误',
                                      'max_value': '【页码】数值错误',
                                  }
                                  )


# 获取订单列表（默认订单列表，分页查询）
class GetOrderDetailForm(Form):
    # 查询第几页，第1页的则传1
    id = forms.IntegerField(min_value=1,
                            required=True,
                            error_messages={
                                'required': '你没有填写【订单id】',
                                'min_value': '【订单id】错误'
                            }
                            )


# 接单
class TakerOrderForm(Form):
    # 订单id
    id = forms.IntegerField(min_value=1,
                            required=True,
                            error_messages={
                                'required': '你没有填写【订单id】',
                                'min_value': '【订单id】错误'
                            }
                            )


# 接单
class SetTakerOrderForm(Form):
    # 订单id
    order_id = forms.IntegerField(min_value=1,
                                  required=True,
                                  error_messages={
                                      'required': '你没有填写【订单id】',
                                      'min_value': '【订单id】错误'
                                  }
                                  )
    # 接单人的id
    user_id = forms.IntegerField(min_value=1,
                                 required=True,
                                 error_messages={
                                     'required': '你没有填写【接单人id】',
                                     'min_value': '【接单人id】错误'
                                 }
                                 )
