from django.urls import path

from . import views

urlpatterns = [
    path('sendVerifyCode/', views.send_verify_code, name='send_verify_code'),
]