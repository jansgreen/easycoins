from django.http import HttpResponse
from django.shortcuts import render
from .socios import KucoinsClass

# Create your views here.

def index(request):
    response = KucoinsClass
    data = response.kucoins_prises()
    return HttpResponse("test")
