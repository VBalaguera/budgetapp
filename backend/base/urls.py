from django.urls import path
from . import views


urlpatterns = [
    # homepage
    path('', views.getRoutes, name='routes'),

    # notes
    path('notes/', views.getNotes, name='notes'),

    # note
    path('notes/<int:pk>/', views.getNote, name='note')
]
