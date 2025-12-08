from rest_framework import serializers
from django.contrib.auth.models import User,Group
from django.contrib.auth.hashers import make_password
from .models import UserProfile,Product


class UserProfileSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    token = serializers.CharField(source='user.auth_token.key', read_only=True)
    class Meta:
        model = UserProfile
        fields = ['name_lastname', 'cellphone','groups','token']

    def get_groups(self, obj):
        return [group.name for group in obj.user.groups.all()] 

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
        # asignamos rol
        try:
            cliente_group = Group.objects.get(name='Cliente')
            user.groups.add(cliente_group)
        except Group.DoesNotExist:
                      pass
        # Crear perfil 
        UserProfile.objects.create(
            user=user,
            name_lastname=nameLastName,
            cellphone=cellphone
            )

        return user
# product serializer 
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'image_url', 'description', 'price', 'stock', 'date_in']

    def get_image_url(self, obj): #Function para obtener la URL de la imagen
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url) # Retorna la URL completa de la imagen