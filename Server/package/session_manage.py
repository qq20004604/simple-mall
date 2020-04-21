#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import time
from configuration.variable import LOGIN_EXPIRE_TIME
from django.utils import timezone


# 登录是否过期
def was_expired(request):
    last_login_timestamp = request.session.get("last_login_timestamp")
    if timezone.now().timestamp() - last_login_timestamp > LOGIN_EXPIRE_TIME:
        return True
    else:
        return False


# 当前是否登录中
def is_logined(request):
    try:
        # 先查看有没有id
        if request.session.get('id') is None:
            # 没有显然是没登录
            return False
        else:
            # 再看登录是否过期
            if was_expired(request) is True:
                # 过期当然也是未登录咯
                return False
            else:
                return True
    except BaseException as e:
        return False


class SessionManage(object):

    # 是否登录
    def is_login(self):
        if self.username is not None:
            if not self.is_login_timeout():
                return True
        return False

    # 登录是否超时
    def is_login_timeout(self):
        try:
            if time.time() - self.this_login_time > LOGIN_TIMEOUT:
                return True
            else:
                return False
        except BaseException as e:
            return True

    # 清除登录状态
    def logout(self):
        # 当前登录的时间
        self.this_login_time = 0
        # 用户id
        self.userid = None
        # 用户名
        self.username = None
        # 用户权限
        self.permission = None
        # 用户状态
        self.status = None
        # 用户创建时间
        self.create_time = None
        # 上一次登录的时间
        self.last_login_time = None
        # 邮箱地址
        self.email = None
        # 如果有登录信息，则清除
        if self.session.get('userid') is not None:
            del self.session['this_login_time']
            del self.session['userid']
            del self.session['username']
            del self.session['permission']
            del self.session['status']
            del self.session['create_time']
            del self.session['last_login_time']
            del self.session['email']

    # 获取用户信息
    def get_userinfo(self):
        d = {
            'userid': self.userid,
            'username': self.username,
            'permission': self.permission,
            'status': self.status,
            'last_login_time': self.last_login_time,
            'email': self.email,
            'create_time': self.create_time
        }
        return d


# 测试和示例代码
if __name__ == '__main__':
    pass
