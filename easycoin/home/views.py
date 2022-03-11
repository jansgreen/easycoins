from decimal import Rounded
import json
from ntpath import join
import time
from unicodedata import digit
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
    USDPrice_append = []
    EURPrice_append = []
    DOPPrice_append= []
    client = Client(api_key, api_secret, api_passphrase)

#    response_symbol = kucoins_Symbols()
#    response_prices = kucoins_prises()
    form = BuyForm
    USD_tickets = client.get_fiat_prices()
    EUR_tickets = client.get_fiat_prices("EUR")

    # lista de las criptomonedas en USD y EUR

    for Symbols in USD_tickets:
        Symbol_append.append(Symbols)

    for prices in USD_tickets:
        if int(float(USD_tickets[prices])) >= 1.00: 
            USD_Deci = int(float(USD_tickets[prices]))
            USD_Roun = round(USD_Deci, 2)
        else:
            USD_Roun = USD_tickets[prices]
        USDPrice_append.append(USD_Roun)

    for EuPrices in EUR_tickets:
        if int(float(EUR_tickets[EuPrices])) >= 1.00: 
            EUR_Deci = int(float(EUR_tickets[EuPrices]))
            EURPri = round(EUR_Deci, 2)
        else:
            EURPri = EUR_tickets[EuPrices]
        EURPrice_append.append(EURPri)

    for prices in USD_tickets:
        if int(float(USD_tickets[prices])) >= 1.00: 
            USD_to_DOP = int(float(USD_tickets[prices])* 56.00) 
            DOP_Roun = round(USD_to_DOP, 2)

        elif int(float(USD_tickets[prices])) == 0:
            DOP_Roun = 56.12*1
        else:
            DOP_Roun = int(56.0000 * float(USD_tickets[prices]))
        DOPPrice_append.append(DOP_Roun)



    search = request.GET.get("Search")
    USDResquest = request.GET.get("USD")
    EURRequest = request.GET.get("EUR")
    DOPRequest = request.GET.get("DOP")

    if search:
        search_upper = search.upper()
        if DOPRequest =="on":
            coins = client.get_fiat_prices('USD')
            checkedswitch = "DOP"
            if int(float(coins[search_upper])) >= 1.00: 
                DOPFiat = int(float(coins[search_upper])* 56.00) 
                Fiat = "DOP $" + str(round(DOPFiat, 2))

            elif int(float(USD_tickets[prices])) == 0:
                Fiat = "DOP $" + str(56.12*1)
            else:
                Fiat = "DOP $" + coins[search_upper]



        elif EURRequest =="on":
            coins = client.get_fiat_prices('EUR')
            checkedswitch = "EUR"
            if int(float(coins[search_upper])) >= 1.00: 
                DOPFiat = int(float(coins[search_upper]))
                Fiat = round(DOPFiat, 2)
            else:
                Fiat = "EUR €" + coins[search_upper]
        else:
            coins = client.get_fiat_prices('USD')
            checkedswitch = "USD"
            Fiat = "USD $" + coins[search_upper]
            if int(float(coins[search_upper])) >= 1.00: 
                DOPFiat = int(float(coins[search_upper]))
                Fiat = round(DOPFiat, 2)
            else:
                Fiat = "USD $" + coins[search_upper]

        context={
            'search':search_upper,
            'Fiat': Fiat,
            'checkedswitch':checkedswitch,
            'form':form,
        }

        return render(request, 'index.html', context)
        
        #    coins = 58.00 ** int(Dop[search])

    context={
        'form':form,
        'Symbols':Symbol_append,
        'USDprice': USDPrice_append,
        'EURPrice': EURPrice_append,
        'DOPPrice':DOPPrice_append,

    }

    return render(request, 'index.html', context)
