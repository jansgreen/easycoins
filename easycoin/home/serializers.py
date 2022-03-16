from http import client
from rest_framework import serializers
from kucoin.client import Client

from .models import Coins, FiatCoins

api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'


class CoinsSerializers(serializers.Serializer):
    id =  serializers.CharField(max_length=100)
    symbol =  serializers.CharField(max_length=256)

    def GetCoinsPrice():
        client = Client(api_key, api_secret, api_passphrase)
        CriptoCoins = client.get_fiat_prices()
        coin = "BTC"
        
        context ={
            'Coin':coin,
            'Price':CriptoCoins[coin]

        }
        return context

