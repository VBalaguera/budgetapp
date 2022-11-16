from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .notes import notes
from .products import products
from .models import Note, Product

from .serializers import *


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

#  token customizing


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

# Users
# getting individual users


@api_view(['GET'])
def getUserProfile(request):
    # gets user data from the token
    user = request.user

    # serialize user data
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)

# products

# all products


@api_view(['GET'])
def getProducts(request):
    # return all products from db
    products = Product.objects.all()
    #  but this is not enough, it needs a serializer to wrap the model and turn all data into json format
    # what to serialize, is it many or just one?
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# getting individual products
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


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
