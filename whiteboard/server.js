const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const router = express.Router();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

router.route("/#").get((req, res) => {
    console.log("GET " + req.params.id);
});

app.listen(3000, "0.0.0.0", function(){
    console.log("Example app listening on port 3000!\n");
});