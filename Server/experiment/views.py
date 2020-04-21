from django.shortcuts import render
from django.http import HttpResponse
import requests
import json

url = 'http://127.0.0.1:8001/'

# Create your views here.
"""
(1)requests.post方法调三方接口（用的是data）
r = requests.post(url+'company/add_friend/', data={'id': 123})
# 这一步将返回值转成json
key = json.loads(r.text)

(2)requests.get方法调三方接口（用的是params）
r = requests.get(url + 'company/search_user/', params={'id': 456})
# 这一步将返回值转成json
key = json.loads(r.text)
"""


# 以 get 形式请求 http 接口
def server_http_request_get(request):
    r = requests.get(url + 'search/item/keywords', params={'id': '123'})
    data = json.loads(r.text)
    return HttpResponse("Hello, world. You're at the polls index.%s" % data['msg'])
