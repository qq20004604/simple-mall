from django.urls import path

from . import views

urlpatterns = [
    path('create/', views.create, name='create'),
    path('list/all/', views.get_order_list_all, name='get_order_list_all'),
    path('detail/public/', views.get_order_detail_public, name='get_order_detail_public'),
    path('list/self/', views.get_order_list_self, name='get_order_list_self'),
    path('detail/private/', views.get_order_detail_private, name='get_order_detail_private'),
    path('order/take/', views.take_order, name='take_order'),
    path('order/set_taker_order/', views.set_take_order, name='set_take_order'),
    path('order/begin/', views.order_begin, name='order_begin'),
    path('order/end/', views.order_end, name='order_end'),
    path('order/rate/', views.order_rate, name='order_rate'),
]
