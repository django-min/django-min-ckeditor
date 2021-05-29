import ClassicEditor from './ckeditor.js';


(function () {
    'use strict';

    const widgets_selector = '.ckeditor-widget';
    const excludes_selector = '.empty-form ' + widgets_selector;
    const inlines_selector = '.inline-group fieldset';
    const inlines_entry_cssclass = 'inline-related';
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
        const widgets = document.querySelectorAll(widgets_selector);
        init_widgets(widgets);

        // select inlines for observing
        const inlines = document.querySelectorAll(inlines_selector);
        if (inlines.length > 0) {
            for (let i = 0; i < inlines.length; ++i) {
                init_inline(inlines[i]);
            }
        }
    };

    function init_widgets(widgets) {
        // create array of widgets in inline empty forms
        if (widgets.length < 1) {
            return
        }
        const excludes = Array.from(
            document.querySelectorAll(excludes_selector)
        );
        for (let i = 0; i < widgets.length; ++i) {
            // only init widgets that arn't in a inline empty form
            if (excludes.indexOf(widgets[i]) < 0) {
                init_widget(widgets[i]);
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
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe

    function init_inline(inline) {
        const observer = new MutationObserver(observe_inline);

        // only track direct children changes
        observer.observe(inline, { childList: true });
    };

    function observe_inline(mutations, obserser) {
        let i, j, mutation, node;
        for (i = 0; i < mutations.length; i++) {
            mutation = mutations[i];

            // bail out if the mutation is something else than a child node
            if (mutation.type != 'childList') {
                continue;
            }

            for (j = 0; j < mutation.addedNodes.length; j++) {
                node = mutation.addedNodes[j];

                // only init the widgets if the added child is an inline entry
                if (node.classList.contains(inlines_entry_cssclass)) {
                    init_widgets(node.querySelectorAll(widgets_selector));
                }
            }
        }
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
