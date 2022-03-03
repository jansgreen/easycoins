import json
from django.http import HttpResponse
from django.shortcuts import render
from .socios import KucoinsClass
from .models import Coins
from .forms import BuyForm
from django.db.models import Q


# Create your views here.

def index(request):
    Symbol_append = []
    price_append = []
    search = request.GET.get("Search")
    if search:
        coins = Coins.objects.filter(
            Q(Symbol__icontains = search) | Q(USD__icontains = search)
            ).distinct()
    elif not search:
        coins = Coins.objects.values_list('Symbol', 'USD')
        total = int(len(coins))-1
        for num in range(0, total):
            symbol = coins[num][0]
            price = coins[num][1]
            Symbol_append.append(symbol)
            price_append.append(price)
    form = BuyForm

    response = KucoinsClass
    response.kucoins_prises()
    lista = response.kucoins_Symbols()

    context={
        'form':form,
        'Symbols':Symbol_append,
        'prices': price_append,
    }

    return render(request, 'index.html', context)
