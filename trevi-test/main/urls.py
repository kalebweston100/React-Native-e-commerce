from django.urls import path
from main import views

urlpatterns = [
    path('', views.healthCheck),
    #receives user data
    path('create-user/', views.createUser),
    #receives login data
    path('login-user/', views.loginUser),
    #no data is needed
    path('display-trending/', views.displayTrending),
    #receives image base64 text
    path('account-upload/', views.uploadAccountImage),
    #no data is needed
    path('account-images/', views.displayAccountImages),
    #no data is needed
    path('display-account/', views.displayAccount),
    #receives grant id
    path('grant-upload/', views.uploadGrantImage),
    #receives item data
    path('post-grant/', views.postGrant),
    #receives item id
    path('remove-grant/', views.removePostedGrant),
    #receives grant id
    path('grant-images/', views.displayGrantImages),
    #no data is needed
    path('display-grants/', views.displayPostedGrants),
    #receives seller_id, grant_id, and matched decision
    path('handle-offer/', views.handleOffer),
    #no data is needed
    path('display-offers/', views.displayOffers),
    #receives wish data
    path('save-wish/', views.saveWishlistItem),
    #no data is needed
    path('display-wishlist/', views.displayWishlist),
    #no data is needed
    path('buy-matches/', views.displayBuyMatches),
    #no data is needed
    path('sell-matches/', views.displaySellMatches)
]
