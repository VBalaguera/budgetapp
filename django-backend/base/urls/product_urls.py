from django.urls import path
from base.views import product_views as views


urlpatterns = [
    # products
    path('', views.getProducts, name='products'),

    # product
    path('<int:pk>/', views.getProduct, name='product'),
]
