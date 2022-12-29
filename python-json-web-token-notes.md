# json web token installation and setup notes

DOCS: https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
Simplejwt DOCS: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/

```py

pip install djangorestframework-simplejwt
```

on settings.py:

```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

```

on base/urls.py:

```py
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [
    # auth
    path('api/users/login/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    # homepage
    path('', views.getRoutes, name='routes'),

    # notes
    path('notes/', views.getNotes, name='notes'),

    # note
    path('notes/<int:pk>/', views.getNote, name='note'),

]
```

With this, accessing users/login I can generate refresh and access tokens. Access tokens are necessary.
I need to add some settings in settings.py:

```py

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

```

## JWT CUSTOMIZATION: PASSING MORE INFORMATION FROM USER INTO TOKEN

Customizing token claims DOCS: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html

in base/views.py:

```py

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

```

This TokenObtainPairView will be inherited by base/urls.py:

```py
urlpatterns = [
    # auth
    path('users/login/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    # homepage
    path('', views.getRoutes, name='routes'),

    # notes
    path('notes/', views.getNotes, name='notes'),

    # note
    path('notes/<int:pk>/', views.getNote, name='note'),


]

```

With this, when users are loging in, I receive their email and username along the token.

## USER SERIALIZER
