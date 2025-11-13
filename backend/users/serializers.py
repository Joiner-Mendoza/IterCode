from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['name_lastname', 'cellphone']


class RegisterUserSerializer(serializers.ModelSerializer):
    nameLastName = serializers.CharField(write_only=True)
    cellphone = serializers.CharField(write_only=True)
    profile = UserProfileSerializer(source='userprofile', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'nameLastName', 'cellphone', 'profile']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Extraer los campos personalizados
        nameLastName = validated_data.pop('nameLastName')
        cellphone = validated_data.pop('cellphone')

        # Crear el usuario  Django
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=make_password(validated_data['password'])
        )

        # Crear perfil 
        UserProfile.objects.create(
            user=user,
            name_lastname=nameLastName,
            cellphone=cellphone
        )

        return user
