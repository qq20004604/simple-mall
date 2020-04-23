from django.urls import path

from . import views

urlpatterns = [
    path('create/', views.create, name='create'),
    path('list/all/', views.get_order_list_all, name='get_order_list_all'),
    path('detail/public/', views.get_order_detail_public, name='get_order_detail_public'),
    path('list/self/', views.get_order_list_self, name='get_order_list_self'),
    path('detail/private/', views.get_order_detail_private, name='get_order_detail_private'),
]
