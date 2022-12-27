# RESOURCES

Using Django with React - an Ecommerce website

## SETTING VIRTUAL ENVIRONMENT with VSC

```sh
pip install virtualenv
```

## Initialize a virtual environment

```sh
python3.9 -m venv venv
```

## ACTIVATE VIRTUAL ENVIRONMENT

```sh
source venv/bin/activate
```

## INSTALL DJANGO

```sh
pip install django
```

## CREATE INITIAL DJANGO PROJECT

```sh
django-admin startproject backend
```

## START SERVER

```sh
python manage.py runserver
```

Server will run at http://127.0.0.1:8000/

## CONFIGURE FIRST APP

```sh
python manage.py startapp base
```

## RUNNING DB

Initial settings located at backend/backend/settings.py:

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

Base will have all api logic.

Register your app into backend/settings:

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # incorporate apps into main project
    'base.apps.BaseConfig'
]
```

Create first route.

On base/views.py:

```py
from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.


def getRoutes(request):
    return JsonResponse('hello', safe=False)

```

Create urls for that route. On base/urls.py:

```py
from django.urls import path
from . import views

urlpatterns = [
    # homepage
    path('', views.getRoutes, name='routes')
]

```

Still, I need to tell main project, backend, that those urls do exist.
On backend/urls.py:

```py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('base.urls')),
]

```

## INITIAL ROUTES FOR THIS PROJECT:

On backend/base I am configuring an initial set of routes for this project:

```py
from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.


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
    return JsonResponse(routes, safe=False)

```

Since the routes is preluded by /api, it needs an update. On backend/backend/urls.py:

```py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.urls')),
]

```

I created a placeholder file called notes.py on base/ for testing purposes. Let's import it into base/views:

```py
def getNotes(request):
    return JsonResponse(notes, safe=False)

```

add that path to urls.py:

```py
from django.urls import path
from . import views

urlpatterns = [
    # homepage
    path('', views.getRoutes, name='routes'),

    # notes
    path('notes/', views.getNotes, name='notes')
]

```

All notes are accessible from http://127.0.0.1:8000/api/notes/.

Install django restframework

```sh
pip install djangorestframework
```

and add it into backend/settings.py:

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',

    # incorporate apps into main project
    'base.apps.BaseConfig'

]
```

django rest-framework DOCS: https://www.django-rest-framework.org/

on backend/base/views:

```py
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


@api_view(['GET'])
def getNote(request, pk):
    note = None
    for i in notes:
        if i['id'] == pk:
            note = i
            break
    return Response(note)
```

Now, that last method is for getting individual notes. Let's put it into base/urls.py:

```py
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

```

Now, we need to fetch data from the backend to the front-end.
Axios will help in this project.

## DB SETUP AND ADMIN PANEL

A migration is required.

```sh
python manage.py migrate
```

This takes all changes and preparations made by Django and apply them.

models.py is where I define how the db is configured.

## How to create an user:

Django already provides an user model.

```sh
python manage.py createsuperuser
```

Django admin panel is at: https://127.0.0.1/8000/admin

## MODELING DATA

In backend/base/models.py, I am going to create data models:

```py
from django.db import models

#  import user model
from django.contrib.auth.models import User

# create a model


class Product(models.Model):
    # one to many rel
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    #  blank enables to leave any field without content
    name = models.CharField(max_length=200, null=True, blank=True)
    # image =
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    # TextField since is a longer text
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    # auto generated, non editable
    _id = models.AutoField(primary_key=True, editable=False)


class Note(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=300, null=True, blank=True)
    body = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

```

Then, after creating all models, run the migration:

```sh
python manage.py makemigrations
```

Then, apply the migrations:

```sh
python manage.py migrate
```

Tables are not in the admin panel yet. To do this, register them in backend/base/admin.py:

```py
from django.contrib import admin

# Register your models here.
from .models import Product, Note

admin.site.register([Product, Note])

```

### A note about Product Image Field, which will be used for Note Image field too:

the model follows this logic:
image = models.ImageField(null=True, blank=True)

However, in order to make it work, an additional package is necessary: pillow

```sh
pip install pillow
```

After that, makemigrations + migrate + runserver.

If I try to upload images, all of them will go to the root folder. That is not a desarible outcome.

After adding models, models.py looks like this:

```py
from django.db import models

#  import user model
from django.contrib.auth.models import User

# create a model


# my models

class Note(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=300, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    body = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Budget(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    budgetLimit = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.title


class Income(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    budget = models.ForeignKey(
        Budget, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Expense(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    budget = models.ForeignKey(
        Budget, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)

    def __str__(self):
        return self.title

# ecommerce models


class Product(models.Model):
    # one to many rel
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    #  blank enables to leave any field without content
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    # TextField since is a longer text
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    # auto generated, non editable
    _id = models.AutoField(primary_key=True, editable=False)

    #  setting product name to screen value at admin panel:
    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    # returns rating
    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    # one to one rel
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)

```

## UPLOADS AND STATIC FILES

A new folder inside backend called static is created. This will have all static files. I need to tell Django first:

```py

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = '/images/'

# static files dir
STATICFILES_DIRS = [BASE_DIR / 'static']

# media root for uploading content
MEDIA_ROOT = 'static/images'

```

And on backend/backend/urls.py:

```py
# make Django work with uploaded files
from django.conf import settings
# allowing connecting static url
from django.conf.urls.static import static


#  which folder to look for media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

Now, I can access all uploaded images on: http://127.0.0.1:8000/images/

## SERIALIZE DATA

I want to get user data from the api.
I need to create serializers.
To do this, let's start with the Product and Note ones.

```py
from .notes import notes
from .products import products
from .models import Note, Product


# notes

# all notes
@api_view(['GET'])
def getNotes(request):
    notes = Note.objects.all()
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


# products

# all products
@api_view(['GET'])
def getProducts(request):
    # return all products from db
    products = Product.objects.all()
    #  but this is not enough, it needs a serializer to wrap the model and turn all data into json format
    return Response(products)


# getting individual products
@api_view(['GET'])
def getProduct(request, pk):
    product = None
    for i in products:
        if i['id'] == pk:
            product = i
            break
    return Response(product)

```

I need to create a serializer. In base/serializers.py:

```py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Note


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        # what to serialize
        model = Product
        #  which info to bring from the api
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

```

Then, they need to be imported into views.py:

```py

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

```

## USER SERIALIZER:

On serializers.py:

```py

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        # what to serialize
        model = User

        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    # populating id with _id
    def get__id(self, obj):
        return obj.id

    # is user admin? populate isAdmin with is_staff
    def get_isAdmin(self, obj):
        return obj.is_staff

    # field customization using serialized method fields for getting name with first_name data
    def get_name(self, obj):
        name = obj.first_name

        # in case no first_name is there
        if name == '':
            name = obj.email
        return name
```

On views.py:

```py
@api_view(['GET'])
def getUserProfile(request):
    # gets user data from the token
    user = request.user

    # serialize user data
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)

```

First, using Postman I created a new req at /api/users/profile. It will need an Auth Bearer (capitalized), which I will extract from the access token. The req will be successful now.

Now, since we configured the app to use the jwt (in settings.py), when I send it request.user sends back a response based on that token.

On urls.py:

```py
    # users
    path('users/profile/', views.getUserProfile, name='users-profile'),
```

## REFRESHING TOKENS and HOW TO DO IT

On serializers.py:

```py
from rest_framework_simplejwt.tokens import RefreshToken

# refreshing token:
class UserSerializerWithToken(UserSerializer):
    # extending one serializer into a new one

    # getting token
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
```

Import it into views.py:

```py
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
```

Now the api endpoint brings another field named token with all the data from token.access_token, along with everything else.

## PROTECTED ROUTES

Certain changes are necessary in rest_framework in order to implement protection and permissions.

In views.py:

```py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.contrib.auth.models import User

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

```

After this, set al urls:

```py
    # users for admins
    path('users/', views.getUsers, name='users-profile'),
```

## REGISTER USERS:

on views.py:

```py
# custom error messages:
from rest_framework import status

from django.contrib.auth.hashers import make_password

# register users
# register users
@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(

            first_name=data['name'],
            username=data['email'],
            email=data['email'],

            # password requires hashing
            password=make_password(data['password'])

            # todo:
            # - make user type password twice, check them out


        )

        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data)

    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


```

And import it into urls.py:

```py
    path('users/register/', views.registerUser, name='register'),
```

## LOGGING WITH EMAIL

When users register/login, they send signals through rest_framework: signal dispatchers.
DOCS: https://docs.djangoproject.com/en/4.1/topics/signals/

on NEWLY CREATED signals.py:

```py

```

connect it into base/apps.py:

```py
class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'

    # connecting signals:
    def ready(self):
        import base.signals

```

## SPREADING URLS AND VIEWS INTO MULTIPLE FILES:

on backend/urls.py:

```py
urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('base.urls')),
    path('api/products/', include('base.urls.product_urls')),

    # users
    path('api/users/', include('base.urls.users_urls')),

    # notes
    path('api/notes/', include('base.urls.notes_urls')),

    # orders
    path('api/orders/', include('base.urls.orders_urls'))
]
```

This is spreading all api urls into multiple parts.  
These will be in base/views/ folder.

The files are:

product_views.py:

```py
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

```

user_views.py:

```py
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
            username=data['email'],
            email=data['email'],

            # password requires hashing
            password=make_password(data['password'])

            # todo:
            # - make user type password twice, check them out


        )

        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data)

    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

```

order_views.py:

```py
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

```

note_views.py:

```py
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

```

Create a new folder in base called urls.
Inside, I am going to create the following files:

product_urls.py:

```py
from django.urls import path
from base.views import product_views as views


urlpatterns = [
    # products
    path('/', views.getProducts, name='products'),

    # product
    path('<int:pk>/', views.getProduct, name='product'),
]

```

user_urls.py:

```py
from django.urls import path
from base.views import user_views as views


urlpatterns = [
    # auth
    path('login/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    # user register

    path('register/', views.registerUser, name='register'),



    # users
    path('profile/', views.getUserProfile, name='users-profile'),

    # users for admins
    path('', views.getUsers, name='users-profile'),


]
```

note_urls.py:

```py
from django.urls import path
from base.views import note_views as views


urlpatterns = [



    # notes
    path('', views.getNotes, name='notes'),

    # note
    path('<int:pk>/', views.getNote, name='note'),
]

```

order_urls.py:

```py
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

```

and finally, on backend/urls.py:

```py
"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# make Django work with uploaded files
from django.conf import settings
# allowing connecting static url
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('base.urls')),
    path('api/products/', include('base.urls.product_urls')),

    # users
    path('api/users/', include('base.urls.user_urls')),

    # notes
    path('api/notes/', include('base.urls.note_urls')),

    # orders
    path('api/orders/', include('base.urls.order_urls'))
]

#  which folder to look for media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```

Just like that.
