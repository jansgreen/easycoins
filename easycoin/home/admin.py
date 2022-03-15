from django.contrib import admin
from .models import Coins, FiatCoins

# Register your models here.
class CoinsAdmin(admin.ModelAdmin):
    fields = ['id', 'symbol']
    list_display = (
        'id',
        'symbol',
        
    )
class FiatCoinsAdmin(admin.ModelAdmin):
    fields = ['id', 'Fiats']
    list_display = (
        'id',
        'Fiats',
        
    )

admin.site.register(Coins, CoinsAdmin)
admin.site.register(FiatCoins, FiatCoinsAdmin)

