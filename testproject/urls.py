from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path


urlpatterns = [
    path(
        'admin/',
        admin.site.urls
    ),
]

urlpatterns += staticfiles_urlpatterns(settings.STATIC_URL)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
