from django.urls import path
from base.views import note_views as views


urlpatterns = [



    # notes
    path('', views.getNotes, name='notes'),

    # note
    path('<int:pk>/', views.getNote, name='note'),
]
