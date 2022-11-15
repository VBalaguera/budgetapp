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
