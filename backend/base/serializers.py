from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Note


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
