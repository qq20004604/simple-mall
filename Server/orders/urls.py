from django.urls import path

from . import views

urlpatterns = [
    path('create/', views.create, name='create'),
    path('list/all/', views.get_order_list_all, name='get_order_list_all'),
]