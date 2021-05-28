from django.db import models


class Conf(models.Model):
    """
    Fake model class to be able to simply add an upload url to the admin
    TODO: find the proper way to achieve that goal without an unneccessary
    db table
    """
