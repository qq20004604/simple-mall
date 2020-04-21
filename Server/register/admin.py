from django.contrib import admin

# Register your models here.

from .models import TelVerifyCode, User

admin.site.register(TelVerifyCode)
admin.site.register(User)
