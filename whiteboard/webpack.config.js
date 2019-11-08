const path = require("path");

const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebPack = require("webpack")

module.exports = {
    mode: "development",
    entry: [
        "webpack-hot-middleware/client",
        "./src/app.js"
    ],
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "common.js",
        publicPath: "/"
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: "babel-loader"
        }, {
            test: /\.vue$/,
            use: "vue-loader"
        }, {
            test : /\.scss$/, 
            use: [
                "vue-style-loader", 
                "css-loader", {
                    loader: "sass-loader",
                    options: {
                        //data: "$color: red;"
                    }
                }
            ]
        }, {
            test : /\.sass$/, 
            use: [
                "vue-style-loader", 
                "css-loader", {
                    loader: "sass-loader",
                    options: {
                        indentedSyntax: true
                    }
                }
            ]
        }, {
            test : /\.css$/, 
            use: ["vue-style-loader", "css-loader"]
        },{
            test: /\.(jpe?g|png|gif|svg|ico)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'images'
                }
            }]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            inject: "body"
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new WebPack.HotModuleReplacementPlugin()
    ]
}