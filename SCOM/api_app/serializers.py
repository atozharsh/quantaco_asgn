from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Customer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ('password',)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone_number', 'email',  'is_active',
                  'created_at', 'modified_at', 'address')