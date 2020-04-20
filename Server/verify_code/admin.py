from django.contrib import admin

# Register your models here.
from .models import SendVerifyCode

admin.site.register(SendVerifyCode)
