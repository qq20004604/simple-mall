from django.db import models


# Create your models here.

# 账号注册
class Register(models.Model):
    tel = models.CharField(
        max_length=11,
        help_text='手机号码'
    )
    name = models.CharField(
        max_length=20,
        help_text='用户昵称（自大20位）'
    )
    register_date = models.DateTimeField(default=timezone.now)

    # 显示的默认信息
    def __str__(self):
        return self.tel
