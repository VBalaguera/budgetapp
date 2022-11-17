from django.db.models.signals import pre_save
# this will execute an action before a model finishes any save process

from django.contrib.auth.models import User

# action to fire off when users are about to be saved:


def updateUser(sender, instance, **kwargs):
    # sender is the function/obj that sends the signal
    # instance is the actual obj

    user = instance

    # checking if email is empty
    if user.email != '':
        user.username = user.email

    print('signal received')


# any time User model is saved, a function will be fired off
pre_save.connect(updateUser, sender=User)
