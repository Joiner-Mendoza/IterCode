from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name_lastname = models.CharField(max_length=100)
    cellphone = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username
    
class Product(models.Model):

    name = models.CharField(max_length=100, verbose_name="Product Name")
    image = models.ImageField(upload_to='products/', verbose_name="Product Image")
    description = models.TextField("Product Description")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Product Price")
    stock = models.IntegerField(verbose_name="Stock Quantity")
    date_in = models.DateTimeField(auto_now_add=True, verbose_name="Date in")
    
    def __str__(self):
        return self.name

