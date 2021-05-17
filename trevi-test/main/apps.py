from django.apps import AppConfig
from corsheaders.signals import check_request_enabled

def check_origin(sender, request, **kwargs):
    exempt_paths = ['/create-user/', '/login-user/']
    authentic = True
    if request.path not in exempt_paths:
        if not request.user.is_authenticated:
            authentic = False
    return authentic


class MainConfig(AppConfig):
    name = 'main'

    #def ready(self):
        #check_request_enabled.connect(check_origin)
