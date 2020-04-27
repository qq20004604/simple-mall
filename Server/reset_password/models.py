from django.db import models
from django.utils import timezone
import datetime
from configuration.variable import VERIFY_CODE_EXPIRE_TIME, SMS_SEND_INTERVAL_TIME, USERTYPE_PUB, USERTYPE_ORDER_TAKER
import random


def make_random_vcode():
    return str(random.randint(1000, 9999))


# 验证码
class ResetVerifyCode(models.Model):
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
