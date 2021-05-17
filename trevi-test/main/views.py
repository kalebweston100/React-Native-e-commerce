from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, renderer_classes, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.renderers import JSONRenderer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from server.settings import MEDIA_ROOT
import base64
from io import BytesIO
from main import models
from main import serializers
from django.http import HttpResponse
import boto3

client = boto3.client('s3',
        aws_access_key_id='AKIAJJWYBAE6XRBZ2PQQ',
        aws_secret_access_key='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',
        region_name='us-west-2')

#keeps health check happy
def healthCheck(request):
    return HttpResponse('healthy')

#creates user
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def createUser(request):
    data = serializers.CreateUserSerializer(data=request.data)
    if data.is_valid():
        username = data.validated_data['username']
        check = User.objects.filter(username=username)
        if check.exists():
            response_data = {'response' : 'taken'}
        else:
            data.save()
            response_data = {'response' : 'valid'}
    else:
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#authenticates user and returns authtoken
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def loginUser(request):
    data = serializers.LoginSerializer(data=request.data)
    if data.is_valid():
        username = data.validated_data['username']
        password = data.validated_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            token = Token.objects.filter(user_id=user.id).first()
            response_data = {'response' : token.key}
        else:
            response_data = {'response' : 'inauthentic'}
    else:
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#displays most recent grants
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayTrending(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    grants = models.Grant.objects.all().order_by('-grant_id')
    final = grants.exclude(account_id=account_id)
    response_data = serializers.DisplayGrantSerializer(grants, many=True)
    return Response(response_data.data)

#uploads profile image
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def uploadAccountImage(request):
    data = serializers.AccountImageSerializer(data=request.data)
    if data.is_valid():
        user_id = request.user.id
        account_id = models.Account.objects.filter(user_id=user_id).first().account_id
        data.save(account_id=account_id)
        response_data = {'response' : 'valid'}
    else:
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#displays account images
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayAccountImages(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    account_images = models.AccountImage.objects.filter(account_id=account_id).first()
    if account_images:
        path = account_images.image.name
        image_data = BytesIO()
        client.download_fileobj('trevi-account', path, image_data)
        string_data = base64.b64encode(image_data.getvalue())
        response_data = {'image' : string_data}
    else:
        response_data = {'image' : 'none'}
    return Response(response_data)

#displays user profile data
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayAccount(request):
    user_id = request.user.id
    user = models.Account.objects.filter(user_id=user_id).first()
    response_data = serializers.DisplayAccountSerializer(user)
    return Response(response_data.data)

#uploads profile image
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def uploadGrantImage(request):
    data = serializers.GrantImageSerializer(data=request.data)
    if data.is_valid():
        data.save()
        response_data = {'response' : 'valid'}
    else:
        print(data.errors)
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#posts an item
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def postGrant(request):
    data = serializers.PostGrantSerializer(data=request.data)
    if data.is_valid():
        user_id = request.user.id
        account_id = models.Account.objects.filter(user_id=user_id).first().account_id
        grant = data.save(account_id=account_id)
        grant_id = grant.grant_id
        response_data = {'response' : grant_id}
    else:
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#removes a posted item
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def removePostedGrant(request):
    data = serializers.IdSerializer(data=request.data)
    if data.is_valid():
        grant_id = data.validated_data['id_value']
        grant = models.Grant.objects.filter(grant_id=grant_id)
        grant.update(display=False)
        #delete item images, but keep data for estimates
        response_data = {'resonse' : 'valid'}
    else:
        response_data = {'response' : 'invalid'}

#displays account images
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayGrantImages(request):
    data = serializers.IdSerializer(data=request.data)
    if data.is_valid():
        grant_id = data.validated_data['id_value']
        grant_image = models.GrantImage.objects.filter(grant_id=grant_id).first()
        if grant_image:
            path = grant_image.image.name
            image_data = BytesIO()
            client.download_fileobj('trevi-grants', path, image_data)
            string_data = base64.b64encode(image_data.getvalue())
            response_data = {'image' : string_data}
        else:
            response_data = {'image' : 'none'}
    else:
        response_data = {'image' : 'error'}
    return Response(response_data)

#displays items posted by the current user
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayPostedGrants(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    grants = models.Grant.objects.filter(account_id=account_id)
    response_data = serializers.DisplayGrantSerializer(grants, many=True)
    return Response(response_data.data)

#creates match if user swipes right on offer
#creates a match row with matched as False if user swipes left
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def handleOffer(request):
    data = serializers.CreateMatchSerializer(data=request.data)
    if data.is_valid():
        user_id = request.user.id
        account_id = models.Account.objects.filter(user_id=user_id).first().account_id
        data.save(buyer_id=account_id)
        response_data = {'response' : 'valid'}
    else:
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#finds matching keywords for wishes in grants
def findOffers(account_id):
    #get titles of wishes
    wish_titles = models.Wish.objects.filter(account_id=account_id).values_list('title', flat=True)
    grants = models.Grant.objects.none()
    #search for each title
    for title in wish_titles:
        keywords = title.split(' ')
        #search for each keyword separately
        for keyword in keywords:
            temp_grants = models.Grant.objects.filter(title__icontains=keyword)
            #add found results to main queryset
            grants = grants | temp_grants
    #exclude grants that user has already decided on
    exclude_ids = models.Match.objects.filter(buyer_id=account_id).values('grant_id')
    #exclude grants that the user posted
    offers = grants.exclude(grant_id__in=exclude_ids)
    final = offers.exclude(account_id=account_id)
    return final

#displays offers that are matches between wishes and grants
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayOffers(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    offers = findOffers(account_id)
    response_data = serializers.DisplayGrantSerializer(offers, many=True)
    return Response(response_data.data)

#adds item to wishlist
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def saveWishlistItem(request):
    data = serializers.PostWishSerializer(data=request.data)
    if data.is_valid():
        user_id = request.user.id
        account_id = models.Account.objects.filter(user_id=user_id).first().account_id
        data.save(account_id=account_id)
        response_data = {'response' : 'valid'}
    else:
        response_data = {'response' : 'invalid'}
    return Response(response_data)

#displays items on feed
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayWishlist(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    wishes = models.Wish.objects.filter(account_id=account_id)
    response_data = serializers.DisplayWishSerializer(wishes, many=True)
    return Response(response_data.data)

#displays BUY matches
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displayBuyMatches(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    seller_ids = models.Match.objects.filter(buyer_id=account_id, matched=True).values('seller_id')
    accounts = models.Account.objects.filter(account_id__in=seller_ids)
    response_data = serializers.DisplayAccountSerializer(accounts, many=True)
    return Response(response_data.data)

#displays SELL matches
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def displaySellMatches(request):
    user_id = request.user.id
    account_id = models.Account.objects.filter(user_id=user_id).first().account_id
    buyer_ids = models.Match.objects.filter(seller_id=account_id, matched=True).values('buyer_id')
    accounts = models.Account.objects.filter(account_id__in=buyer_ids)
    response_data = serializers.DisplayAccountSerializer(accounts, many=True)
    return Response(response_data.data)
