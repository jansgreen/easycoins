import json
from kucoin.client import Client
from .models import Coins
from asgiref.sync import async_to_sync
import time
import pprint
from decimal import *
from .models import CoinsTest





api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'

def KukoinCurrencies():
    client = Client(api_key, api_secret, api_passphrase)
    response = client.get_fiat_prices()
    EUR_response = client.get_fiat_prices("EUR")

#    print(symbols_json)
    JSON_Objsct = []
    num = 0

    for data in response:
        num+=1
        if int(Decimal(response[data])) >= 1.00 :
            USD_Deci =Decimal(response[data])
            USD_Roun = '{:,}'.format(round(USD_Deci, 2))
        else:
            USD_Roun = '{:,}'.format(Decimal(response[data]))

        if int(Decimal(EUR_response[data])) >= 1.00:
            EUR_Deci = Decimal(EUR_response[data])
            EUR_Roun = '{:,}'.format(round(EUR_Deci, 2))
        else:
            EUR_Roun = '{:,}'.format(Decimal(EUR_response[data]))

        if int(Decimal(response[data])*Decimal(56)) >=1.00: 
            DOP_Deci = Decimal(response[data])*Decimal(56)
            DOP_Roun = '{:,}'.format(round(DOP_Deci, 2))
        else:
            DOP_Roun = '{:,}'.format(Decimal(response[data])*Decimal(56))

        dataJson = {
            "pk" : num,
            "Symbol" :data,
            "USD" : str(USD_Roun),
            "EUR" : str(EUR_Roun),
            "DOP" : str(DOP_Roun),
        }
        JSON_Objsct.append(dataJson)
    return JSON_Objsct

def Get_From_Kucoin():
    client = Client(api_key, api_secret, api_passphrase)
    return client





    








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
    connectId = {
    "id": int(time.time() * 1000),
    "type": "subscribe",
    "topic": "/market/ticker:BTC-USDT",
    "response": True
}
    client = Client(api_key, api_secret, api_passphrase)
    nonce = int(time.time() * 1000)
    TokenObject = client.get_ws_endpoint(private=False) #._generate_signature(nonce = int(time.time() * 1000), method='GET', path="/market/ticker:BTC-USDT", data=data) #.get_ws_endpoint(private=False) #.get_symbols() 
    timestamp = client.get_timestamp()

    print(timestamp)
       
    context ={
        'token':TokenObject['token'],
        'timestamp':timestamp

    }
    return context

def AllTikets():

    client = Client(api_key, api_secret, api_passphrase)
    tikers = client.get_symbols()
    symbols = pprint.pformat(tikers)

  



