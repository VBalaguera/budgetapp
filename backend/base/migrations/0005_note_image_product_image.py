# Generated by Django 4.0.4 on 2022-11-16 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_order_expense_ispaid_income_ispaid_alter_budget_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
