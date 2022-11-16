from django.urls import path
from . import views


urlpatterns = [
    # auth
    path('users/login/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    # homepage
    path('', views.getRoutes, name='routes'),

    # users
    path('users/profile/', views.getUserProfile, name='users-profile'),

    # products
    path('products/', views.getProducts, name='products'),

    # product
    path('products/<int:pk>/', views.getProduct, name='product'),


    # notes
    path('notes/', views.getNotes, name='notes'),

    # note
    path('notes/<int:pk>/', views.getNote, name='note'),
]
