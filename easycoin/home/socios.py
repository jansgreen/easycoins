import json
from kucoin.client import Client


api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'
class KucoinsClass:



    def kucoins_prises():
        client = Client(api_key, api_secret, api_passphrase, {"verify": False, "timeout": 20})
        tickets = client.get_ticker('BTC-USD')
        print(tickets)
        return tickets
