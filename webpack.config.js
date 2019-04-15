const path = require('path')

const HTMLPlugin = require('html-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
    target: 'web',
    entry: path.join(__dirname,'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname,'dist')
    } ,
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name]-abc.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all',
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'all',
                    name: 'vendor',
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin(),
        new VueLoaderPlugin()
    ]
}

if (isDev) {
    config.module.rules.push(
    {
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            'stylus-loader'
        ]
    },
    )
    config.devtool = '#cheaper-module-eval-source-map'
    config.devServer = {
        port: 8888,
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        //open: true,
        hot: true,
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{
    config.entry = {
        app: path.join(__dirname,'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
    {
        test: /\.styl/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options:{
                    publicPath:'../'
                }
            },
            'css-loader',
            'stylus-loader'
        ]
    },
 )
 config.plugins.push(
    new MiniCssExtractPlugin(
        {filename:'style.[contenthash:8].css'}
    ),
 )
}


module.exports = config