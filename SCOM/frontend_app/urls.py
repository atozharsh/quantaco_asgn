from django.urls import path
from frontend_app.views import *

urlpatterns = [
    path('', index, name='index'),
    path('customer-data/', customer, name='customer_data'),
    path('logout/', logout, name='logout')
]