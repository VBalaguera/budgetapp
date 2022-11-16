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
