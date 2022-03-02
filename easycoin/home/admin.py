from django.contrib import admin
from .models import Coins

# Register your models here.
class CoinsAdmin(admin.ModelAdmin):
    fields = ['id','Symbol', 'USD']
    list_display = (
        'id',
        'Symbol',
        'USD',
    )

admin.site.register(Coins, CoinsAdmin)

