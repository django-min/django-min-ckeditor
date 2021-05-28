from django import forms
from django.contrib import admin

from min_ckeditor.widgets import CKEditorWidget

from .models import Item


class ItemForm(forms.ModelForm):

    class Meta:
        fields = '__all__'
        model = Item
        widgets = {
            # 'abstract': CKEditorWidget,
            'description': CKEditorWidget,
        }


class ItemInline(admin.StackedInline):

    form = ItemForm
    model = Item
    extra = 0


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):

    form = ItemForm
    inlines = [ItemInline]
    readonly_fields = ['parent']
