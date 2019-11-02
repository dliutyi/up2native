const http = require("http");
const express = require("express");
const app = express();

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require('./webpack.config.js');
const compiler = webpack(config);

const mongo = require("mongodb").MongoClient;

var server = http.createServer(app);
var io = require("socket.io").listen(server);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

server.listen(3000, "0.0.0.0", function(){
    console.log("Example app listening on port 3000!\n");
});

const url = "mongodb://127.0.0.1:27017";
const params = { useUnifiedTopology: true, useNewUrlParser: true };
mongo.connect(url, params, function(err, db){
    console.log("connected");
    db.close();
});

var msgCounter = 0;

io.on("connection", function(socket){
    console.log("user connected");
    socket.on("heartbeat", function(msg){
        msgCounter = msgCounter + 1;
        io.emit("heartbeat", "" + msgCounter);
        console.log("message: " + msg);
    });
    socket.on("disconnect", function(){
        console.log("user disconnected");
    });
});