from django.contrib import admin
from .models import Coins, FiatCoins, CoinsTest

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

class CoinsTestAdmin(admin.ModelAdmin):
    fields = ['id', 'Symbol', 'USD','EUR','DOP']
    list_display = (
        'id',
        'Symbol', 
        'USD',
        'EUR',
        'DOP'
        
    )


admin.site.register(Coins, CoinsAdmin)
admin.site.register(FiatCoins, FiatCoinsAdmin)
admin.site.register(CoinsTest, CoinsTestAdmin)


