from django.db import models



class FiatCoins(models.Model):
    id =  models.CharField(max_length=100 , primary_key=True)
    Fiats =  models.CharField(max_length=256, blank=True, null=True)

# Create your models here.
class Coins(models.Model):
    id =  models.CharField(max_length=100 , primary_key=True)
    symbol =  models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return self.symbol

class CoinsTest(models.Model):
    id = models.CharField(max_length=100 , primary_key=True), 
    Symbol =  models.CharField(max_length=256, blank=True, null=True)
    USD = models.CharField(max_length=256, blank=True, null=True)
    EUR = models.CharField(max_length=256, blank=True, null=True)
    DOP = models.CharField(max_length=256, blank=True, null=True)