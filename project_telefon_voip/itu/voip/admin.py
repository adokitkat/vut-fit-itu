from django.contrib import admin
from .models import Profile, Contact, User

admin.site.register(Profile)
admin.site.register(User)
admin.site.register(Contact)