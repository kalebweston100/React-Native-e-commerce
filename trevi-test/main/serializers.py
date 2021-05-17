from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from main import models
from django.core.files.base import ContentFile
from django.core.files.images import ImageFile
import base64
from server.settings import MEDIA_ROOT
import os
from io import BytesIO
import boto3

client = boto3.client('s3',
        aws_access_key_id='AKIAJJWYBAE6XRBZ2PQQ',
        aws_secret_access_key='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',
        region_name='us-west-2')

#serializer for receiving ids
class IdSerializer(serializers.Serializer):
    id_value = serializers.IntegerField()

#creates User, Token, and Account
class CreateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.CharField()

    class Meta:
        model = models.Account
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        user = User.objects.create_user(username=username, password=password, email=email)
        token = Token.objects.create(user=user)
        validated_data['user_id'] = user.id
        account = models.Account.objects.create(**validated_data)
        return account

#used for user login data
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

#used to display user accounts
class DisplayAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Account
        exclude = ['account_id', 'user_id']

#adds and displays account images
class AccountImageSerializer(serializers.Serializer):
    image = serializers.CharField()

    def save(self, *args, **kwargs):
        account_id = kwargs.pop('account_id')
        path = 'account_id-{}.jpg'.format(account_id)
        full_path = os.path.join(MEDIA_ROOT, path)
        raw_image = self.validated_data['image']
        image_file = ContentFile(base64.b64decode(raw_image))
        image_file.name = path
        current = models.AccountImage.objects.filter(account_id=account_id).first()
        if current:
            os.remove(full_path)
            current.image = image_file
            current.save()
        else:
            current = models.AccountImage.objects.create(account_id=account_id, image=image_file)
        client.upload_file(full_path, 'trevi-account', path)
        return current

#adds and displays grant images
class GrantImageSerializer(serializers.Serializer):
    grant_id = serializers.IntegerField()
    image = serializers.CharField()

    def save(self, *args, **kwargs):
        grant_id = self.validated_data['grant_id']
        path = 'grant_id-{}.jpg'.format(grant_id)
        full_path = os.path.join(MEDIA_ROOT, path)
        raw_image = self.validated_data['image']
        image_file = ContentFile(base64.b64decode(raw_image))
        image_file.name = path
        grant_image = models.GrantImage.objects.create(grant_id=grant_id, image=image_file)
        client.upload_file(full_path, 'trevi-grants', path)
        return grant_image

'''
#adds and displays account images
class AccountImageSerializer(serializers.Serializer):
    image = serializers.CharField()

    def save(self, *args, **kwargs):
        account_id = kwargs.pop('account_id')
        path = 'account/account_id-{}.jpg'.format(account_id)
        raw_image = self.validated_data['image']
        image_file = ContentFile(base64.b64decode(raw_image))
        image_file.name = path
        current = models.AccountImage.objects.filter(account_id=account_id).first()
        if current:
            full_path = os.path.join(MEDIA_ROOT, path)
            os.remove(full_path)
            current.image = image_file
            current.save()
        else:
            current = models.AccountImage.objects.create(account_id=account_id, image=image_file)
        return current

#adds and displays grant images
class GrantImageSerializer(serializers.Serializer):
    grant_id = serializers.IntegerField()
    image = serializers.CharField()

    def save(self, *args, **kwargs):
        grant_id = self.validated_data['grant_id']
        path = 'grant/grant_id-{}.jpg'.format(grant_id)
        raw_image = self.validated_data['image']
        image_file = ContentFile(base64.b64decode(raw_image))
        image_file.name = path
        grant_image = models.GrantImage.objects.create(grant_id=grant_id, image=image_file)
        return grant_image
'''

#used to post item
class PostGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Grant
        exclude = ['grant_id', 'account_id', 'display']

#used to display items
class DisplayGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Grant
        fields = '__all__'

#saves a wish
class PostWishSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Wish
        exclude = ['wish_id', 'account_id']

#displays a wish
class DisplayWishSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Wish
        fields = '__all__'

#saves match
class CreateMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Match
        fields = ['seller_id', 'grant_id', 'matched']
