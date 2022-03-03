import json
from django import forms
from .models import Coins
from django.forms import ModelForm

class BuyForm(forms.Form):

    Have_Symbols= forms.ModelChoiceField(queryset=Coins.objects.all().order_by('Symbol').order_by('Symbol'), empty_label="I have...", widget=forms.Select(attrs={'class':'btn btn-outline-secondary dropdown-toggle', 'type': 'button', 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false'}))
    Have_amount = forms.IntegerField( widget=forms.NumberInput(attrs={'class':'form-control', 'placeholder':'0.00', 'type': 'text', 'aria-label':'ingresa la cantidad'}))
    Want_Symbols= forms.ModelChoiceField(queryset=Coins.objects.all().order_by('Symbol'), empty_label="I want...", widget=forms.Select(attrs={'class':'btn btn-outline-secondary dropdown-toggle', 'type': 'button', 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false'}))
    Want_amount = forms.IntegerField( widget=forms.NumberInput(attrs={'class':'form-control', 'placeholder':'0.00', 'type': 'text', 'aria-label':'ingresa la cantidad'}))
