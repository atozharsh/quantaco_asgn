from django.db import models

# Create your models here.
class Gender(models.TextChoices):
    MALE = 'M', 'MALE'
    FEMALE = 'F', 'FEMALE'
    OTHERS = 'O', 'OTHER'


class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=Gender.choices, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    modified_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"