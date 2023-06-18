var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        code:[
            './src/app.js'
        ],

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    //devtool: 'source-map',
    //mode: "development",
    watch: false,
    mode: "production",
    optimization: { minimize: true },
    resolve: {
        extensions: [".js",".json",".css"]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            {
                                plugins: [
                                    "@babel/plugin-proposal-class-properties",
                                    "@babel/plugin-transform-runtime"
                                ]
                            }
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        })
    ]
};
