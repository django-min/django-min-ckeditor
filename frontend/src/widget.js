import ClassicEditor from './ckeditor.js';


(function () {
    'use strict';

    const selector = '.ckeditor-widget';
    const default_toolbar = {
        // viewportTopOffset: 84,
        items: [
            'clipboard',
            'heading',
            '|',
            'bold',
            'italic',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'removeFormat',
            '|',
            'imageUpload',
        ]
    };

    dom_ready(init);

    function init() {
        // TODO prevent init on inline empty/hidden forms
        const elements = document.querySelectorAll(selector);
        const hidden = document.querySelectorAll('.empty-form ' + selector);
        console.log(Array.from(hidden))

        if (elements.length > 0) {
            for (let i = 0; i < elements.length; ++i) {
                init_widget(elements[i])
            }
        }
    };

    function init_widget(el) {
        el._area = el.querySelector('textarea');
        el._form = el._area.form;
        el._conf = {
            django_upload: get_django_upload(el),
            toolbar: get_toolbar(el)
        };

        ClassicEditor
            .create(el._area, el._conf)
            .then(editor => { el._editor = editor; })
            .catch(error => { console.error(error.stack); });
    };


    function get_django_upload(el) {
        // get the csrf middleware token
        const csrf_el = document.querySelector('[name="csrfmiddlewaretoken"]');
        const csrf_token = !csrf_el ? '' : csrf_el.value;

        // get the upload url
        const upload_url = el.dataset.upload_url;

        // build the conf
        return {
            csrf_token: csrf_token,
            uploadUrl: upload_url,
        };
    };

    function get_toolbar(element) {
        // TODO add mechanisme to choose a toolbar from predefined sets
        var toolbar;
        try {
            toolbar = JSON.parse(element.dataset.toolbar);
        } catch (e) {
            // console.log(e)
        }
        if (!toolbar) {
            toolbar = default_toolbar;
        }
        return toolbar;
    };

    function dom_ready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };
})();
