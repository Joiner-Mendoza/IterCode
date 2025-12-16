from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status,permissions
from .serializers import *
from .models import *
from django.contrib.auth import authenticate
from django.contrib.auth.models import User,Group
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from rest_framework import generics

from .models import Product
from .serializers import ProductSerializer
class LoginView(APIView): #login
    def post(self, request):


        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username = username, password = password)

        if user is not None:
            token, created = Token.objects.get_or_created(user=user) # obtiene o crea token
            return Response({
                'message': 'Login exitoso',
                'token': token.key,
                'username': user.username
                }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales invalidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
class UserListView(APIView):#lista de usuarios en BD
    def get(self, request):
        users = User.objects.all()
        serializer = RegisterUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterUserView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)

        if serializer.is_valid():
            # Usar validated_data en lugar de serializer.data
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')

            # verificamos que el usuario y el email no s eencuentres en BD
            if User.objects.filter(username=username).exists():
                return Response(
                    {'error': 'El nombre de usuario ya existe'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User.objects.filter(email=email).exists():
                return Response(
                    {'error': 'El email ya está en uso'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()

            return Response(
                {'message': 'Usuario registrado con éxito'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# solo el usuario autenticado puede ver su info
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = RegisterUserSerializer(request.user)
        return Response(serializer.data)
    
# product view
class ProductView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)



class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
        queryset = Product.objects.all()
        serializer_class = ProductSerializer
    
# Funcion para obtener los grupos disponibles
@api_view(['get'])
def get_user_groups(request):
    groups = Group.objects.values('id','name')
    return Response(groups)

# VISTA PARA CREAR ORDEN

class CreateOrderView(APIView):
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user if request.user.is_authenticated else None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

