import json
from django.http import HttpResponse
from django.shortcuts import render
from .socios import kucoins_prises, kucoins_Symbols
from .models import Coins
from .forms import BuyForm
from django.db.models import Q
from asgiref.sync import async_to_sync


# Create your views here.

def index(request):
    Symbol_append = []
    price_append = []
    response_symbol = kucoins_Symbols()
    response_prices = kucoins_prises()
    form = BuyForm

    search = request.GET.get("Search")
    print(search)
    if search:
        coins = Coins.objects.filter(
            Q(Symbol__icontains = search) | Q(USD__icontains = search)
            ).distinct()
        total = int(len(coins))-1

#        print(coins)
#        for num in coins[1]:
#            print(num)
#           Symbol_append.append(symbol)
#            price_append.append(price)
    elif not search:
        coins = Coins.objects.values_list('Symbol', 'USD')
        total = int(len(coins))-1
        for num in range(0, total):
            symbol = coins[num][0]
            price = coins[num][1]
            Symbol_append.append(symbol)
            price_append.append(price)
    else:
        coins = Coins.objects.values_list('Symbol', 'USD')
        total = int(len(coins))-1
        for num in range(0, total):
            symbol = coins[num][0]
            price = coins[num][1]
            Symbol_append.append(symbol)
            price_append.append(price)


    context={
        'form':form,
        'Symbols':Symbol_append,
        'prices': price_append,
    }

    return render(request, 'index.html', context)
