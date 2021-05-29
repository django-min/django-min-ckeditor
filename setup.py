# import os
import min_ckeditor
from setuptools import setup, find_packages


def readme():
    with open('README.md') as f:
        return f.read()


setup(
    name='django-min-ckeditor',
    version=min_ckeditor.__version__,
    author='Alaric Mägerle',
    author_email='info@rouxcode.ch',
    description='django-min ckeditor',
    long_description=readme(),
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
        'docs'
        'example',
    ]),
    include_package_data=True,
    zip_safe=False,
)
