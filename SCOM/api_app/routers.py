from rest_framework.routers import DefaultRouter
from .views import CustomerViewset, UserViewset

router = DefaultRouter()
router.register('customer', CustomerViewset, basename='customer')
router.register('user', UserViewset, basename='user')