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

    # 是否达到每日最大发送上限
    def is_over_max_daily(self):
        DAILY_MAX = 5
        now = datetime.datetime.now()
        start = now - datetime.timedelta(hours=23, minutes=59, seconds=59)
        result = ResetVerifyCode.objects.filter(tel=self.tel, send_date__gt=start)
        if len(result) > DAILY_MAX:
            return '单日发送验证短信的条数不能超过 %s 条' % DAILY_MAX
        else:
            return True
