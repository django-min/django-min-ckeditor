// webpack.config.js

'use strict';

const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
    // https://webpack.js.org/configuration/entry-context/
    entry: './src/widget.js',

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.resolve(
            __dirname, '..',
            'min_ckeditor',
            'static',
            'min_ckeditor',
            'js'
        ),
        //path: path.resolve(__dirname, 'dist'),
        filename: 'widget.js'
    },

    // Useful for debugging.
    devtool: 'source-map',

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false },

    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                use: ['raw-loader']
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig({
                            themeImporter: {
                                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                            },
                            minify: true
                        })
                    }
                ]
            }
        ]
    }
};