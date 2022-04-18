#from crypt import methods
from decimal import Rounded
import json
from ntpath import join
import time
from unicodedata import digit
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect
from .socios import kucoins_prises, kucoins_Symbols, token, AllTikets, KukoinCurrencies, Get_From_Kucoin
from .models import Coins
from .forms import BuyForm
from django.db.models import Q
from asgiref.sync import async_to_sync
from .serializers import CoinsSerializers
from requests.structures import CaseInsensitiveDict
from kucoin.client import Client
from django.http import JsonResponse
from django.utils.safestring import mark_safe
from django.core.paginator import Paginator

from .addCoinsSym import kucoins_fixtures
from decimal import *



client = Get_From_Kucoin()



def index(request):
    kucoins = KukoinCurrencies()
    TokenObj = token()
    form = BuyForm

# buscar una criptomoneda
    search = request.GET.get("Search")
    EURRequest = request.GET.get("EUR")
    DOPRequest = request.GET.get("DOP")

    if search:
        search_upper = search.upper()
        if DOPRequest =="on":
            coins = client.get_fiat_prices('USD')
            checkedswitch = "DOP"
            if int(float(coins[search_upper])) >= 1: 
                DOPFiat = Decimal(coins[search_upper])*Decimal(56)
                format = '{:,}'.format(round(DOPFiat, 2))
                Fiat = "DOP $" + str(format)
            else:
                Fiat = "DOP $" + coins[search_upper]
        elif EURRequest =="on":
            coins = client.get_fiat_prices('EUR')
            checkedswitch = "EUR"
            if int(float(coins[search_upper])) >= 1: 
                EURFiat = float(coins[search_upper])
                format = '{:,}'.format(round(EURFiat, 2))
                Fiat = "EUR €" + str(format)
            else:
                Fiat = "EUR €" + coins[search_upper]
        else:
            coins = client.get_fiat_prices('USD')
            checkedswitch = "USD"
            Fiat = "USD $" + coins[search_upper]
            if float(coins[search_upper]) >= 1.00: 
                USDFiat = float(coins[search_upper])
                format = '{:,}'.format(round(USDFiat, 2))
                Fiat = "USD $" + str(format)
            else:
                Fiat = "USD $" + coins[search_upper]

        context={
            'search':search_upper,
            'Fiat': Fiat,
            'checkedswitch':checkedswitch,
            'form':form,
        }

        return render(request, 'index.html', context)
    
    paginator = Paginator(kucoins, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)


    context={
        'page_obj':page_obj,
        'token': TokenObj,
        'form':form,
    }
    return render(request, 'index.html', context)



def Processexchange(request):
    symbolAppen = []
    pricesAppen = []
    if request.method == 'GET':
        prueba01 = request.GET['Have_Symbols']
        prueba02 = request.GET['Have_amount']
        prueba03 = request.GET['Want_Symbols']
        I_Have = client.get_ws_endpoint(private=True) #get_full_order_book ('KCS-BTC')#.get_fiat_prices('Have_Symbols')
        print("=======================")
        print(I_Have)
        print("===================")

    return redirect('index')