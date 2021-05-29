import ClassicEditor from './ckeditor.js';


(function () {
    'use strict';

    const widgets_selector = '.ckeditor-widget';
    const excludes_selector = '.empty-form ' + widgets_selector;

    const inlines_selector = '.inline-group';
    const stacked_selector = 'fieldset';
    const stacked_entry_cssclass = 'inline-related';
    const tabular_selector = 'tbody';
    const tabular_entry_cssclass = 'form-row';

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

    // widget -----------------------------------------------------------------

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

    function get_toolbar(el) {

        // TODO add mechanisme to choose a toolbar from predefined sets
        var toolbar;
        try {
            toolbar = JSON.parse(el.dataset.toolbar);
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
        let css_class, wrap;

        // create observer object
        let observer = new MutationObserver(observe_inline);

        // set stacked/tabular selectors/css classes
        if (inline.dataset.inlineType === 'stacked') {
            observer._class = stacked_entry_cssclass;
            wrap = inline.querySelector(stacked_selector);
        } else {
            observer._class = tabular_entry_cssclass;
            wrap = inline.querySelector(tabular_selector);
        }

        // only track direct children changes
        observer.observe(wrap, { childList: true });
    };

    function observe_inline(mutations, observer) {
        let i, j, mutation, node;
        for (i = 0; i < mutations.length; i++) {

            // bail out if the mutation is something else than a child node
            if (mutations[i].type != 'childList') {
                continue;
            }

            for (j = 0; j < mutations[i].addedNodes.length; j++) {
                node = mutations[i].addedNodes[j];
                // only init the widgets if the added child is an inline entry
                if (node.classList.contains(observer._class)) {
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
