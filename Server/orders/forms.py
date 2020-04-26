#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from package.form import Form, forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_even(value):
    split_list = [x for x in value.split(',') if x]
    for item in split_list:
        if len(item) > 8:
            raise ValidationError(
                _('单个标签最多只能有8个字'),
                params={'value': value},
            )


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
                              validate_even
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


# 接单及其他修改订单状态的接口
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
class SetOrderTakerForm(Form):
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


# 评价
class OrderRateForm(Form):
    # 订单id
    id = forms.IntegerField(min_value=1,
                            required=True,
                            error_messages={
                                'required': '你没有填写【订单id】',
                                'min_value': '【订单id】错误'
                            }
                            )
    # 评价分数
    score = forms.IntegerField(min_value=1,
                               max_value=5,
                               required=True,
                               error_messages={
                                   'required': '你没有填写【评价打分】',
                                   'min_value': '【接单人id】错误'
                               }
                               )
    # 评价内容
    score_des = forms.CharField(max_length=255,
                                error_messages={
                                    'max_length': '【评价内容】最多255字'
                                }
                                )
