import json
from kucoin.client import Client
from .models import Coins


api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'
class KucoinsClass:



    def kucoins_prises():
        client = Client(api_key, api_secret, api_passphrase)
        tickets = client.get_fiat_prices()
        id = 0
        for coin in tickets:
            id +=1
            symbol = coin
            price=tickets[symbol]
            Coins.objects.update_or_create(
                Symbol=symbol,
                defaults={'USD': price},
            )
        return tickets
    
    def kucoins_Symbols():
        client = Client(api_key, api_secret, api_passphrase)
        tickets = client.get_symbols()
        return tickets
