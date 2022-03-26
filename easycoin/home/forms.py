from django import forms
from .models import Coins, FiatCoins
from django.forms import ModelForm


class BuyForm(forms.Form):

    Have_Symbols= forms.ModelChoiceField(queryset=Coins.objects.values_list('symbol' , flat=True).order_by('symbol'), empty_label="I have...", widget=forms.Select(attrs={'class':'btn btn-outline-secondary dropdown-toggle', 'type': 'button', 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false', 'name': 'HaveSymbols'}))
    Have_amount = forms.IntegerField( widget=forms.NumberInput(attrs={'class':'form-control', 'placeholder':'0.00', 'type': 'text', 'aria-label':'ingresa la cantidad', 'name': 'HaveAmount'}))
    Want_Symbols= forms.ModelChoiceField(queryset=Coins.objects.values_list('symbol', flat=True).order_by('symbol'), empty_label="I want...", widget=forms.Select(attrs={'class':'btn btn-outline-secondary dropdown-toggle', 'type': 'button', 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false', 'name': 'WantSymbols'}))
    Want_amount = forms.IntegerField( widget=forms.NumberInput(attrs={'class':'form-control', 'placeholder':'0.00', 'type': 'text', 'aria-label':'ingresa la cantidad', 'name': 'Want_amount'}))

