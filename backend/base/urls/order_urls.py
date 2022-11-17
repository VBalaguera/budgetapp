from django.urls import path
from base.views import order_views as views


urlpatterns = [



    # # notes
    # path('/', views.getNotes, name='notes'),

    # # note
    # path('/<int:pk>/', views.getNote, name='note'),
]

#  TODO: create these routes for budgets and expenses
# @api_view(['GET'])
# def getRoutes(request):
#     routes = [
#         '/api/budgets/'
#         '/api/budgets/create/'
#         '/api/budgets/<update>/<id>/'
#         '/api/expenses/'
#         '/api/expenses/create/'
#         '/api/expenses/<update>/<id>/'
#     ]
#     return Response(routes)
