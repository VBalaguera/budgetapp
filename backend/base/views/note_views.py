from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
# permissions from rest_framework
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
# for custom error messages
from rest_framework import status

from django.contrib.auth.models import User

from base.notes import notes
from base.products import products
from base.models import Note, Product

from base.serializers import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password


# notes

# all notes
@api_view(['GET'])
def getNotes(request):
    notes = Note.objects.all()
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)


# getting individual notes
@api_view(['GET'])
def getNote(request, pk):
    note = Note.objects.get(id=pk)
    serializer = NoteSerializer(note, many=False)

    return Response(serializer.data)
