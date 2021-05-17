from django.db import models

#account to store user data
class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    #id of the User object related to the account
    user_id = models.IntegerField()
    first_name = models.TextField()
    last_name = models.TextField()
    bio = models.TextField(default='')

#stores images for user account
class AccountImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    account_id = models.IntegerField()
    image = models.ImageField()
    #image num to use for multiple images

#item posted to the app
class Grant(models.Model):
    grant_id = models.AutoField(primary_key=True)
    #account id of the poster
    account_id = models.IntegerField()
    category = models.TextField()
    #id of the category the item is posted to
    #category_id = models.IntegerField()
    title = models.TextField()
    description = models.TextField()
    condition = models.TextField()
    price = models.IntegerField()
    display = models.BooleanField(default=True)

#images of items
class GrantImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    grant_id = models.IntegerField()
    image = models.ImageField()
    #image num to use for multiple images

#saves a wish
class Wish(models.Model):
    wish_id = models.AutoField(primary_key=True)
    account_id = models.IntegerField()
    category = models.TextField()
    title = models.TextField()
    condition = models.TextField()
    min_price = models.IntegerField()
    max_price = models.IntegerField()

#saves matches between buyers and sellers
#and keeps rejected offers from beings shown
class Match(models.Model):
    match_id = models.AutoField(primary_key=True)
    buyer_id = models.IntegerField()
    seller_id = models.IntegerField()
    grant_id = models.IntegerField()
    matched = models.BooleanField(blank=True, default=False)

'''
#estimates of item prices
class Estimate(models.Model):
    estimate_id = models.AutoField(primary_key=True)
    keyword_value = models.TextField()
    condition = models.TextField()
    lower = models.IntegerField()
    higher = models.IntegerField()
'''
'''
#locations of items
class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    #id of the item the location is for
    item_id = models.IntegerField()
    #change to decimal?
    longitude = models.TextField()
    latitude = models.TextField()
'''
