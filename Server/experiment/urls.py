from django.urls import path

from . import views

urlpatterns = [
    path('', views.server_http_request_get, name='server_http_request_get'),
]
