from django.test import TestCase
from kucoin.client import Client
from .models import Coins
import os
import json
from pathlib import Path



api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'

class KucoinsSymbTestCase(TestCase):
    fixtures = ['Coins.json', 'Coin']

    def setUp(self):
        # Test definitions as before.
        call_setup_methods()

    def test_fluffy_animals(self):
        # A test that uses the fixtures.
        call_some_test_code()


def kucoins_fixtures():
    kucoinAppend = []
    client = Client(api_key, api_secret, api_passphrase)
    tickets = client.get_fiat_prices()
    id = 0
    for coin in tickets:
        id +=1
        symbol = str(coin)
        kucoinAppend.append({
            "model": "home.Coins",
            "pk": id,
            "fields": {
                "Web":'Kucoins',
                "Symbol": symbol,
                }
        })

    url = str('./home/fixtures/Coins.json')
    with open(url, 'w') as file:
        json.dump(kucoinAppend, file, indent=4)

                      
    return tickets