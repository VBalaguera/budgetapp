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
