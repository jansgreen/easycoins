# Generated by Django 3.2.12 on 2022-03-09 20:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_auto_20220309_1451'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coins',
            old_name='data',
            new_name='symbol',
        ),
    ]