from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .notes import notes
from .models import Note
# Create your views here.

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

#  token customizing


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # data customization
        data['username'] = self.user.username
        data['email'] = self.user.email

        return data

# token customizing


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
