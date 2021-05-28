from django.db import models


class Item(models.Model):

    parent = models.ForeignKey(
        'testapp.Item',
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,
    )

    abstract = models.TextField(
        blank=True,
        default='',
    )
    description = models.TextField(
        blank=True,
        default='',
    )

    def __str__(self):
        return '{}: #{}'.format(self.__class__.__name__, self.pk)
