import ClassicEditor from './ckeditor.js';


(function () {
    'use strict';

    const widgets_selector = '.ckeditor-widget';
    const excludes_selector = '.empty-form ' + widgets_selector;
    const inlines_selector = '.inline-group fieldset';

    const default_toolbar = {
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
        // select all ckeditor widgets
        const elements = document.querySelectorAll(widgets_selector);
        // create array of widgets in inline empty forms
        const excludes = Array.from(
            document.querySelectorAll(excludes_selector)
        );
        if (elements.length > 0) {
            for (let i = 0; i < elements.length; ++i) {
                // only init widgets that arn't in a inline empty form
                if (excludes.indexOf(elements[i]) < 0) {
                    init_widget(elements[i]);
                }
            }
        }

        // select inlines for observing
        const inlines = document.querySelectorAll(inlines_selector);
        if (inlines.length > 0) {
            for (let i = 0; i < inlines.length; ++i) {
                init_inline(inlines[i]);
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
            uploadUrl: upload_url
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


    // inlines ----------------------------------------------------------------

    function init_inline(inline) {
        const observer = new MutationObserver(observe);
        observer.observe(inline, {
            childList: true, // observe direct children
            subtree: false, // and lower descendants too
            characterDataOldValue: false // pass old data to callback
        });
    };

    function observe(record) {
        console.log(record);
    };


    // Utilities --------------------------------------------------------------

    function dom_ready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };
})();
