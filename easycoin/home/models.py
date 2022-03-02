from django.db import models

# Create your models here.
class Coins(models.Model):
    id =  models.CharField(max_length=100 , primary_key=True)
    Symbol = models.CharField(max_length=30)
    USD = models.CharField(max_length=30)