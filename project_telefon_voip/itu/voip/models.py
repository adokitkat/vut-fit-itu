from django.db import models
from django.conf import settings
from django.urls import reverse

class Profile(models.Model):
  id = models.AutoField(primary_key=True)
  name = models.CharField(max_length=200, blank=False, unique=False)
  surname = models.CharField(max_length=200, blank=True, unique=False)
  image = models.ImageField()
  
  def __str__(self):
      return self.name
  
  added = models.BooleanField(default=False)
  add_date = models.DateTimeField('date added', null=True, blank=True)

class Contact(Profile):
  pass

class User(Profile):
  pass
