import os
import min_ckeditor
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name='django-admin-styles',
    version=min_ckeditor.__version__,
    author='Alaric Mägerle',
    author_email='info@rouxcode.ch',
    description='django min ckeditor',
    long_description=read('README.md'),
    url='https://github.com/django-min/django-min-ckeditor',
    license='MIT',
    keywords=['django'],
    platforms=['OS Independent'],
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Development Status :: 3 - Alpha',
    ],
    install_requires=[
        'django>=3.2',
        'django-filer=>2.0.2',
    ],
    packages=find_packages(exclude=[
        'example',
        'docs'
    ]),
    include_package_data=True,
    zip_safe=False,
)
