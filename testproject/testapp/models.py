from django.db import models


class ItemAbstract(models.Model):

    abstract = models.TextField(
        blank=True,
        default='',
    )
    description = models.TextField(
        blank=True,
        default='',
    )

    class Meta:
        abstract = True

    def __str__(self):
        return '{}: #{}'.format(self.__class__.__name__, self.pk)


class Item(ItemAbstract):

    class Meta:
        abstract = False


class ItemStacked(ItemAbstract):

    parent = models.ForeignKey(
        'testapp.Item',
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,
        related_name='stacked_item_set',
    )

    class Meta:
        abstract = False


class ItemTabular(ItemAbstract):

    parent = models.ForeignKey(
        'testapp.Item',
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,
        related_name='tabular_item_set',
    )

    class Meta:
        abstract = False
