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


# Users

# token customizing
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # using UserSerializerWithToken

        serializer = UserSerializerWithToken(self.user).data

        # looping through all the items in the Serializer, find token
        for k, v in serializer.items():
            # set data k to v
            data[k] = v

        return data

# token customizing


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# getting individual users


@api_view(['GET'])
# adding permissions
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    # gets user data from the token
    user = request.user

    # serialize user data
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)

# setting staff permissions for users


@permission_classes([IsAdminUser])
@api_view(['GET'])
def getUsers(request):

    users = User.objects.all()

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# register users
@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(

            first_name=data['name'],

            email=data['email'],
            username=data['email'],

            # password requires hashing
            password=make_password(data['password'])

            # todo:
            # - make user type password twice, check them out


        )

        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data)

    except:
        message = {'detail': 'An error ocurred. '}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
