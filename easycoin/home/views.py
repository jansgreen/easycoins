#from crypt import methods
from decimal import Rounded
import json
from ntpath import join
import time
from unicodedata import digit
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from .socios import kucoins_prises, kucoins_Symbols, token, AllTikets
from .models import Coins
from .forms import BuyForm
from django.db.models import Q
from asgiref.sync import async_to_sync
from .serializers import CoinsSerializers
from requests.structures import CaseInsensitiveDict
from kucoin.client import Client
from django.http import JsonResponse
from django.utils.safestring import mark_safe

from .addCoinsSym import kucoins_fixtures
from decimal import *





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
    DOP_tickets = client.get_fiat_prices()
    USD_tickets = client.get_fiat_prices()
    EUR_tickets = client.get_fiat_prices("EUR")
    # lista de las criptomonedas en USD y EUR
    

    for Symbols in USD_tickets:
        Symbol_append.append(Symbols)

    for prices in USD_tickets:
        if int(float(USD_tickets[prices])) >= 1.00: 
            USD_Deci = int(float(USD_tickets[prices]))
            USD_Roun = round(USD_Deci, 2)
            USD_to_DOP = USD_Roun * 56
            DOP_Roun = USD_to_DOP
        else:
            USD_Roun = USD_tickets[prices]
            DOP_Roun = Decimal(USD_tickets[prices])*Decimal(56)

        USDPrice_append.append(USD_Roun)
        DOPPrice_append.append(DOP_Roun)

    for EuPrices in EUR_tickets:
        if int(float(EUR_tickets[EuPrices])) >= 1.00: 
            EUR_Deci = int(float(EUR_tickets[EuPrices]))
            EURPri = round(EUR_Deci, 2)
        else:
            EURPri = EUR_tickets[EuPrices]
        EURPrice_append.append(EURPri)



# buscar una criptomoneda

    search = request.GET.get("Search")
    EURRequest = request.GET.get("EUR")
    DOPRequest = request.GET.get("DOP")

    if search:
        search_upper = search.upper()
        if DOPRequest =="on":
            coins = client.get_fiat_prices('USD')
            checkedswitch = "DOP"
            if int(float(coins[search_upper])) >= 1.00: 
                print(Decimal(coins[search_upper]))
                DOPFiat = Decimal(coins[search_upper])*Decimal(56) 
                Fiat = "DOP $" + str(round(float(DOPFiat), 2))
            else:
                Fiat = "DOP $" + coins[search_upper]
        elif EURRequest =="on":
            coins = client.get_fiat_prices('EUR')
            checkedswitch = "EUR"
            if int(float(coins[search_upper])) >= 1.00: 
                DOPFiat = int(float(coins[search_upper]))
                Fiat = "EUR €" + str(round(DOPFiat, 2))
            else:
                Fiat = "EUR €" + coins[search_upper]
        else:
            coins = client.get_fiat_prices('USD')
            checkedswitch = "USD"
            Fiat = "USD $" + coins[search_upper]
            if int(float(coins[search_upper])) >= 1.00: 
                DOPFiat = int(float(coins[search_upper]))
                Fiat = "USD $" + str(round(DOPFiat, 2))
            else:
                Fiat = "USD $" + coins[search_upper]

        context={
            'search':search_upper,
            'Fiat': Fiat,
            'checkedswitch':checkedswitch,
            'form':form,
        }

        return render(request, 'index.html', context)

    context={
        'token': TokenObj,
        'form':form,
        'Symbols':Symbol_append,
        'USDprice': USDPrice_append,
        'EURPrice': EURPrice_append,
        'DOPPrice':DOPPrice_append,

    }
    return render(request, 'index.html', context)



def Processexchange(request):
    symbolAppen = []
    pricesAppen = []
    if request.method == 'POST':
        haveSymbols = request['Have_Symbols']
        haveamount = request['Have_amount']
        print(haveSymbols)
        print(haveamount)

        ExchangePrice = "ExchangePrice"

#    client = Client(api_key, api_secret, api_passphrase)
#    tickets = client.get_fiat_prices("EUR")
#    for coins in tickets:
#        symbol = coins
#        price = tickets[coins]
#        symbolAppen.append(symbol)
#        pricesAppen.append(price)
#    Coin = Coins.objects.all()
#    Seria = CoinsSerializers(Coin, many=True)
#    return JsonResponse(Seria.data, safe=False)

#        print(request.POST)
#        HaveSymbols = 
#        HaveAmount = 
#        WantSymbols =
#        WantAmount = 
 #   return HttpResponseRedirect('/thanks/')


