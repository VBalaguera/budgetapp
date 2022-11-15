from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .notes import notes
# Create your views here.


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/notes/'
        '/api/notes/create/'
        '/api/notes/delete/<id>/'
        '/api/notes/<update>/<id>/'

        '/api/budgets/'
        '/api/budgets/create/'
        '/api/budgets/<update>/<id>/'

        '/api/expenses/'
        '/api/expenses/create/'
        '/api/expenses/<update>/<id>/'
    ]
    return Response(routes)


@api_view(['GET'])
def getNotes(request):
    return Response(notes)


# getting individual notes
@api_view(['GET'])
def getNote(request, pk):
    note = None
    for i in notes:
        if i['id'] == pk:
            note = i
            break
    return Response(note)
