from django import forms
from django.urls import reverse
from django.utils.safestring import mark_safe


class CKEditorWidget(forms.Textarea):

    widget = forms.Textarea
    template_name = 'min_ckeditor/widget.html'

    class Media:
        css = {
            'screen': [
                'min_ckeditor/css/widget.css',
            ],
        }
        js = [
            'min_ckeditor/js/widget.js',
        ]

    def get_context(self, *args, **kwargs):
        context = super().get_context(*args, **kwargs)
        context['css_class'] = self.get_css_class()
        context['data_attrs'] = self.get_data_attrs()
        return context

    def get_css_class(self):
        classes = ['ckeditor-widget']
        return mark_safe(' '.join(classes))

    def get_data_attrs(self):
        upload_url = reverse('admin:min_ckeditor-upload')
        data = [
            'data-upload_url="{}"'.format(upload_url),
        ]
        return mark_safe(' '.join(data))
