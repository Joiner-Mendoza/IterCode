from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterUserSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


class LoginView(APIView): #login
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username = username, password = password)
        if user is not None:
            return Response({'message': 'Login exitoso', 'username': user.username}, status=status.HTTP_200_OK)
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
            serializer.save()
            return Response({'message': 'Usuario registrado con exito'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





