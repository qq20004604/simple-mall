from django.contrib import admin

# Register your models here.

from .models import ResetVerifyCode

admin.site.register(ResetVerifyCode)
