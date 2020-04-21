from django.urls import path

from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('had_logined/', views.had_logined, name='had_logined'),
    path('logout/', views.logout, name='logout'),
]
