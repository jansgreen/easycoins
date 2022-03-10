from django.contrib import admin
from .models import Coins

# Register your models here.
class CoinsAdmin(admin.ModelAdmin):
    fields = ['id', 'symbol']
    list_display = (
        'id',
        'symbol',
        
    )

admin.site.register(Coins, CoinsAdmin)

