from django.urls import path
from base.views import user_views as views


urlpatterns = [
    # auth
    path('login/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    # user register

    path('register/', views.registerUser, name='register'),



    # users
    path('profile/', views.getUserProfile, name='users-profile'),

    # users for admins
    path('', views.getUsers, name='users-profile'),


]
