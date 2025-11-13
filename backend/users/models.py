from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name_lastname = models.CharField(max_length=100)
    cellphone = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username
