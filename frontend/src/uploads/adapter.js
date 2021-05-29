import Adapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';


export default class DjangoUploadAdapter extends Plugin {
    /**
         * @inheritDoc
         */
    static get requires() {
        return [FileRepository];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'DjangoUploadAdapter';
    }

    /**
     * @inheritDoc
     */
    init() {
        const options = this.editor.config.get('django_upload');

        if (!options) {
            return;
        }

        if (!options.uploadUrl) {
            /* check uploadUorl */
            logWarning('django-upload-adapter-missing-uploadurl');
            return;
        }

        if (!options.csrf_token) {
            /* check uploadUorl */
            logWarning('django-upload-adapter-missing-csrftoken');
            return;
        }

        this.editor.plugins.get(FileRepository).createUploadAdapter = loader => {
            return new DjangoAdapter(loader, options);
        };
    }
}

class DjangoAdapter {
    /**
     * Creates a new adapter instance.
     *
     * @param {module:upload/filerepository~FileLoader} loader
     * @param {module:django_adapter~DjangoUploadAdapter} options
     */
    constructor(loader, options) {
        /**
         * FileLoader instance to use during the upload.
         *
         * @member {module:upload/filerepository~FileLoader} #loader
         */
        this.loader = loader;

        /**
         * The configuration of the adapter.
         *
         * @member {module:django_adapter~DjangoUploadAdapter} #options
         */
        this.options = options;
    }

    /**
     * Starts the upload process.
     *
     * @see module:upload/filerepository~UploadAdapter#upload
     * @returns {Promise}
     */
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }


    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }


    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open('POST', this.options.uploadUrl, true);
        xhr.responseType = 'json';
    }

    /**
     * Initializes XMLHttpRequest listeners
     *
     * @private
     * @param {Function} resolve Callback function to be called when the request is successful.
     * @param {Function} reject Callback function to be called when the request cannot be completed.
     * @param {File} file Native File object.
     */
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || response.error) {
                return reject(response && response.error && response.error.message ? response.error.message : genericErrorText);
            }

            const urls = response.url ? { default: response.url } : response.urls;

            // Resolve with the normalized `urls` property and pass the rest of the response
            // to allow customizing the behavior of features relying on the upload adapters.
            resolve({
                ...response,
                urls
            });
        });

        // Upload progress when it is supported.
        /* istanbul ignore else */
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    /**
     * Prepares the data and sends the request.
     *
     * @private
     * @param {File} file File instance to be uploaded.
     */
    _sendRequest(file) {
        // Set headers if specified.
        const headers = this.options.headers || {};

        // Use the withCredentials flag if specified.
        const withCredentials = this.options.withCredentials || false;

        for (const headerName of Object.keys(headers)) {
            this.xhr.setRequestHeader(headerName, headers[headerName]);
        }

        this.xhr.withCredentials = withCredentials;

        // Prepare the form data.
        const data = new FormData();

        // append file to form data
        data.append('upload', file);

        // append csrf token to form data
        data.append('csrfmiddlewaretoken', this.options.csrf_token);

        // Send the request.
        this.xhr.send(data);
    }
}