# Generated by Django 3.2.12 on 2022-03-26 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0012_remove_coins_fiat'),
    ]

    operations = [
        migrations.CreateModel(
            name='CoinsTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Symbol', models.CharField(blank=True, max_length=256, null=True)),
                ('USD', models.IntegerField()),
                ('EUR', models.IntegerField()),
                ('DOP', models.IntegerField()),
            ],
        ),
    ]
