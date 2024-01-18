from django.shortcuts import render
from django.shortcuts import redirect
# Create your views here.

def index(request):
    return render(request, 'frontend/index.html')

def customer(request):
    return render(request, 'frontend/customer.html')

def logout(request):
    if 'accessToken' in request.session:
        request.session.pop('accessToken')
    if 'refreshToken' in request.session:
        request.session.pop('refreshToken')
    # return render(request, 'frontend/index.html')
    return redirect('index')