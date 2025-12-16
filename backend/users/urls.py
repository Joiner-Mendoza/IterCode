from django.urls import path
from .views import *
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('login/', obtain_auth_token, name='api_login'),  
    path('register/', RegisterUserView.as_view(), name='register'),

    path('products/', ProductView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    
    path('groups/',get_user_groups,name='users-groups'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),

    path("orders/", CreateOrderView.as_view(), name="create-order"),

]
    