
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use:[
                "style-loader",
                "css-loader", {
                    loader: "sass-loader"
                }
            ]
        }, {
            test: /\.sass$/,
            use:[
                "style-loader",
                "css-loader", {
                    loader: "sass-loader",
                    options: {
                        indentedSyntax: true
                    }
                }
            ]
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    },
    devServer: {
        contentBase: "./dist",
        open: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css"
        }),
        new CleanWebpackPlugin(),
        new Webpack.HotModuleReplacementPlugin()
    ]
};