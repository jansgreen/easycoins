import json
from django.http import HttpResponse
from django.shortcuts import render
from .socios import KucoinsClass
from .models import Coins

# Create your views here.

def index(request):
    Symbol_append = []
    price_append = []
    response = KucoinsClass
    response.kucoins_prises()
    coins = Coins.objects.values_list('Symbol', 'USD')
    total = int(len(coins))-1
    for num in range(0, total):
        symbol = coins[num][0]
        price = coins[num][1]
        Symbol_append.append(symbol)
        price_append.append(price)
    context={
        'Symbols':Symbol_append,
        'prices': price_append,
    }

    return render(request, 'index.html', context)
