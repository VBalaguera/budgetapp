from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
# permissions from rest_framework
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
# for custom error messages
from rest_framework import status


from base.notes import notes
from base.products import products
from base.models import Note, Product

from base.serializers import *


# products

@api_view(['GET'])
# products
# all products
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
