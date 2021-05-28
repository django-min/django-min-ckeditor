
import os

from django import forms
from django.contrib import admin
from django.http import JsonResponse, HttpResponseBadRequest
from django.urls import path

from filer import settings as filer_settings
from filer.models import Folder, File, Image

from .models import Conf


def file_is_image_by_name(file_name):
    """
    check if the uploaded file is an image by extension
    this way we can check if we need a django-filer file or image form
    """
    image_extentions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
    ]
    extension = os.path.splitext(file_name)[1].lower()
    return extension in image_extentions


def get_filer_folder(request):
    """
    get or create the default django-filer folder
    as we dont wanna use the defunctional standard way from django-filer
    """
    name = 'Unsorted'
    folder, created = Folder.objects.get_or_create(name=name)
    if created and request.user:
        folder.owner = request.user
        folder.save()
    return folder


class UploadForm(forms.Form):
    """
    simple file upload form
    """
    upload = forms.FileField()


class FilerFileForm(forms.ModelForm):
    """
    simple form to create a django-filer file
    """

    class Meta:
        model = File
        fields = [
            'file',
            'is_public',
            'original_filename',
            'owner',
        ]

    def get_urls(self, obj):
        return {
            'url': obj.file.url
        }


class FilerImageForm(forms.ModelForm):
    """
    Simple form to create a django-filer image
    """

    class Meta:
        model = Image
        fields = [
            'file',
            'is_public',
            'original_filename',
            'owner',
        ]

    def get_urls(self, obj):
        return {
            'urls': {
                'default': obj.file.url
            }
        }


@admin.register(Conf)
class ConfAdmin(admin.ModelAdmin):
    """
    CKEditor admin
    provides upload url for the ckeditor widget
    """

    def get_urls(self):
        urls = [
            path(
                'upload/',
                self.admin_site.admin_view(self.upload_view),
                name='min_ckeditor-upload'
            ),
        ]
        return urls

    def upload_view(self, request, *args, **kwarg):
        # TODO implement permissions
        data = {}

        # get upload form
        upload_form = UploadForm(request.POST or None, request.FILES or None)

        # return bad request if the upload form isnt valid
        if not upload_form.is_valid():
            return HttpResponseBadRequest()

        # get the file from the upload_form
        upload = upload_form.cleaned_data['upload']

        # get the proper filer file form class *ç*!?!!*
        # needed because of the supperb polymorphic nature of filer files
        form_class = FilerFileForm
        if file_is_image_by_name(upload.name):
            form_class = FilerImageForm

        # get the file form
        form_data = {
            'owner': request.user.pk,
            'original_filename': upload.name,
            'folder': get_filer_folder(request),
            'is_public': filer_settings.FILER_IS_PUBLIC_DEFAULT,
        }
        file_form = form_class(form_data, {'file': upload})

        # return bad request if the file form isnt valid
        if not file_form.is_valid():
            return HttpResponseBadRequest()

        obj = file_form.save(commit=False)

        # check if a file with the same sha1 exists (on file system too)
        existing = File.objects.filter(sha1=obj.sha1).first()
        if existing and os.path.isfile(existing.file.path):
            # return the urls from existing one
            data = file_form.get_urls(existing)
        else:
            # save newly uploaded file and return its urls
            obj.save()
            data = file_form.get_urls(obj)
        return JsonResponse(data)

    def get_model_perms(self, request):
        """
        Ugly workaround
        Return empty perms dict to hide the model from admin index.
        """
        return {}
