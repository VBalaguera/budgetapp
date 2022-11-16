from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register([Product, Note, Income, Budget, Expense,
                    Order, OrderItem, Review, ShippingAddress])
