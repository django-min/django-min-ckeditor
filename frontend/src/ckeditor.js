// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// Default Plugins
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Font from '@ckeditor/ckeditor5-font/src/font';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';

// Custom File Upload adapter
import DjangoUploadAdapter from './uploads/adapter';

// Custom image plugin
import DjangoImage from './images/plugin';



export default class ClassicEditor extends ClassicEditorBase { };


// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
    DjangoUploadAdapter,
    DjangoImage,

    Essentials,
    Clipboard,
    CodeBlock,
    Autoformat,
    Bold,
    Italic,
    Underline,
    Strikethrough, Code, Subscript, Superscript,
    BlockQuote,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    Link,
    List,
    Paragraph,
    Alignment,
    Font,
    PasteFromOffice,
    MediaEmbed,
    RemoveFormat,
    Table, TableToolbar,
    TableProperties, TableCellProperties,
    Indent, IndentBlock,
    Highlight,
    TodoList,
];

const full_toolbar = {
    items: [
        'heading',
        '|',
        'outdent',
        'indent',
        '|',
        'bold',
        'italic',
        'link',
        'underline',
        'strikethrough',
        'code',
        'subscript',
        'superscript',
        'highlight',
        '|',
        'codeBlock',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'blockQuote',
        'imageUpload',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        'mediaEmbed',
        'removeFormat',
        'insertTable',
    ]
};