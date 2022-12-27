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
    notes = Note.objects.all().order_by('id')
    # TODO: order by date when possible
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

#  posting notes:


@api_view(['POST'])
def postNotes(request):
    data = request.data

    try:
        post = notes.objects.create(
            title=data['title'],
            body=data['body'],

        )
        serializer = NoteSerializer(post, many=False)

        return Response(serializer.data)

    except:
        message = {'message': 'An error ocurred'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


# class Note(models.Model):
#     id = models.AutoField(primary_key=True, editable=False)
#     user = models.ForeignKey(
#         User, on_delete=models.CASCADE, null=True, blank=True)
#     title = models.CharField(max_length=300, null=True, blank=True)
#     image = models.ImageField(null=True, blank=True)
#     body = models.TextField(null=True, blank=True)
#     createdAt = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title
# getting individual notes


@api_view(['GET'])
def getNote(request, pk):
    note = Note.objects.get(id=pk)
    serializer = NoteSerializer(note, many=False)

    return Response(serializer.data)
