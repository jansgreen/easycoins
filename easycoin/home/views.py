import json
from ntpath import join
import time
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from .socios import kucoins_prises, kucoins_Symbols, token, AllTikets
from .models import Coins
from .forms import BuyForm
from django.db.models import Q
from asgiref.sync import async_to_sync
import requests
from requests.structures import CaseInsensitiveDict
from kucoin.client import Client
from .addCoinsSym import kucoins_fixtures



# Create your views here.
api_key = '621d6f9927c8800001b3e408'
api_secret = '7906e97b-853e-4408-af59-79c7ac1c0d76'
api_passphrase = '624973'
def index(request):
    TokenObj = token()
    AllTiket = AllTikets()
    addKucoinJson = kucoins_fixtures()
    addKucoinJson
    Symbol_append = []
    price_append = []
    client = Client(api_key, api_secret, api_passphrase)

#    response_symbol = kucoins_Symbols()
#    response_prices = kucoins_prises()
    form = BuyForm

    search = request.GET.get("Search")
    USDResquest = request.GET.get("USD")
    EURRequest = request.GET.get("EUR")
    DOPRequest = request.GET.get("DOP")
    if EURRequest =="on":
        coins = client.get_fiat_prices('USD')
        checkedswitch = "USD"
    elif DOPRequest =="on":
        coins = client.get_fiat_prices('EUR')
        checkedswitch = "EUR"

    if search:
        Dop = client.get_fiat_prices('USD')
        checkedswitch = "DOP"
    #    coins = 58.00 ** int(Dop[search])

    tickets = client.get_fiat_prices()
    for prices in tickets:
        Symbols = prices
        prices = tickets[prices]
        Symbol_append.append(Symbols)
        price_append.append(prices)

    context={
        'checkedswitch':checkedswitch,
        'connectId':TokenObj['timestamp'],
        'token':TokenObj['token'],
        'form':form,
        'Symbols':Symbol_append,
        'prices': price_append,
    }

    return render(request, 'index.html', context)
