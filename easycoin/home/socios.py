import json
from kucoin.client import Client
from .models import Coins
from asgiref.sync import async_to_sync
import time
import pprint





api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'


def kucoins_prises():
    client = Client(api_key, api_secret, api_passphrase)
    tickets = client.get_fiat_prices()
    id = 0
    for coin in tickets:
        id +=1
        symbol = str(coin)

        newCoins = Coins.objects.create(
            id = id,
            Fiat = ['USD', 'EUR', 'DOP'],
            symbol = symbol
        )
#            id = str(id),
#            symbol = str(symbol),
#            Web = "Kucoins",
            
#        )
        newCoins.save()
                         
    return tickets
    
def kucoins_Symbols():
    client = Client(api_key, api_secret, api_passphrase)
    tickets = client.get_symbols()
    return tickets

def token():
    client = Client(api_key, api_secret, api_passphrase)
    TokenObject = client.get_ws_endpoint(private=False) #.get_symbols()
    timestamp = client.get_timestamp()
       
    context ={
        'token':TokenObject['token'],
        'timestamp':timestamp

    }
    return context

def AllTikets():

    client = Client(api_key, api_secret, api_passphrase)
    tikers = client.get_symbols()
    symbols = pprint.pformat(tikers)

  



