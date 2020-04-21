from django.db import models
from django.utils import timezone
import datetime
from configuration.variable import VERIFY_CODE_EXPIRE_TIME, SMS_SEND_INTERVAL_TIME
import random


def make_random_vcode():
    return str(random.randint(1000, 9999))


# 验证码
class TelVerifyCode(models.Model):
    tel = models.CharField(
        max_length=11,
        help_text='手机号码'
    )
    vcode = models.CharField(
        default=make_random_vcode,  # 随机生成1000~9999四位数字
        max_length=4,
        help_text='验证码'
    )
    send_date = models.DateTimeField(default=timezone.now)

    # 显示的默认信息
    def __str__(self):
        return self.tel

    # 是否大于发送间隔（有效时间 VERIFY_CODE_EXPIRE_TIME 秒）
    def over_interval(self):
        return self.send_date < timezone.now() - datetime.timedelta(seconds=SMS_SEND_INTERVAL_TIME)

    # 是否过期（有效时间 VERIFY_CODE_EXPIRE_TIME 秒）
    def was_outdated(self):
        return self.send_date < timezone.now() - datetime.timedelta(seconds=VERIFY_CODE_EXPIRE_TIME)


# 账号注册
class User(models.Model):
    tel = models.CharField(
        max_length=11,
        help_text='手机号码'
    )
    username = models.CharField(
        max_length=20,
        help_text='用户昵称（2~20位）'
    )
    password = models.CharField(
        max_length=40,
        help_text='密码（8~20位）'
    )
    usertype = models.CharField(
        default='',
        max_length=2,
        help_text='用户类型（01发布人，02接单人）'
    )

    register_date = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # 显示的默认信息
    def __str__(self):
        return self.tel

    # 是否是发布者
    def is_pub_user(self):
        return self.usertype == '01'

    # 是否是接单人
    def is_order_user(self):
        return self.usertype == '02'

    # 修改最后登录时间
    def set_last_login(self):
        self.last_login = timezone.now()
