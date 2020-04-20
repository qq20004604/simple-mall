import datetime

from django.db import models
# 注意，settings已经改了配置，去除时区了，所以时间默认和服务器相关
from django.utils import timezone


# Create your models here.
# 模型层 用法参照这个文档：https://docs.djangoproject.com/zh-hans/3.0/topics/db/models/
# 发送手机验证码的表
class SendVerifyCode(models.Model):
    tel = models.CharField(
        max_length=11,
        help_text='手机号码'
    )
    vcode = models.CharField(
        max_length=6,
        help_text='验证码'
    )
    send_date = models.DateTimeField(default=timezone.now)

    # 显示的默认信息
    def __str__(self):
        return self.tel

    # 是否过期（有效时间5分钟）
    def was_outdated(self):
        return self.send_date < timezone.now() - datetime.timedelta(minutes=5)
