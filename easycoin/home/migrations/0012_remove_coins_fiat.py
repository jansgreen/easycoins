# Generated by Django 3.2.12 on 2022-03-12 23:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_coins_fiat'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coins',
            name='Fiat',
        ),
    ]
