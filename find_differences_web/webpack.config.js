var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        code:[
            './src/App.ts'
        ],

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devtool: 'source-map',
    mode: "development",
    watch: true,
    // mode: "production",
    // optimization: { minimize: true },
    resolve: {
        extensions: [".js",".json",".ts",".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
};
