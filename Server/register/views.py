from django.shortcuts import render
from django.http import HttpResponse
import requests
import json
from package.decorator_csrf_setting import my_csrf_decorator
from package.request_method_limit import post_limit
from package.response_data import get_res_json


# Create your views here.
@my_csrf_decorator()
@post_limit
def reg(request):
    return HttpResponse("Hello, world. You're at the polls index.")
