#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 装饰器：接口请求方式限制
from package.response_data import get_res_json
from package.session_manage import is_logined
from configuration.variable import USERTYPE_PUB, USERTYPE_ORDER_TAKER


# 加了这个装饰器后，如果请求方式不是post，那么自动返回错误信息
def post_limit(func):
    def wrapper(*args, **kw):
        request = args[0]
        if request.method != 'POST':
            return get_res_json(code=0, msg='请使用POST方式请求')
        return func(*args, **kw)

    return wrapper


# 加了这个装饰器后，如果请求方式不是post，那么自动返回错误信息
def get_limit(func):
    def wrapper(*args, **kw):
        request = args[0]
        if request.method != 'GET':
            return get_res_json(code=0, msg='请使用POST方式请求')
        return func(*args, **kw)

    return wrapper


# 登录限制。如果用户没有登录，则自动返回错误信息
def login_limit(func):
    def wrapper(*args, **kw):
        request = args[0]
        if is_logined(request) is False:
            return get_res_json(code=5, msg='请先登录')
        return func(*args, **kw)

    return wrapper


# 用户类型限制（限制为发布者）
def pub_limit(func):
    def wrapper(*args, **kw):
        request = args[0]
        # 先要求是登录状态
        if is_logined(request) is False:
            return get_res_json(code=5, msg='请先登录')
        if request.session.get("usertype") != USERTYPE_PUB:
            return get_res_json(code=10, msg='用户类型错误，角色必须是订单发布者才能执行该操作')
        return func(*args, **kw)

    return wrapper


# 用户类型限制（限制为接单人）
def order_taker_limit(func):
    def wrapper(*args, **kw):
        request = args[0]
        # 先要求是登录状态
        if is_logined(request) is False:
            return get_res_json(code=5, msg='请先登录')
        if request.session.get("usertype") != USERTYPE_ORDER_TAKER:
            return get_res_json(code=10, msg='用户类型错误，角色必须是订单接单人才能执行该操作')
        return func(*args, **kw)

    return wrapper
