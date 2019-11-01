const path = require('path');

const http = require("http");
const express = require("express");
const app = express();

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require('./webpack.config.js');
const compiler = webpack(config);

var server = http.createServer(app);
var io = require("socket.io").listen(server);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

// app.get(/#/, function(req, res) {
//     console.log("default path");
//     res.send("initialization");
//     //res.sendFile(path.join(__dirname, "index.html"));
// });

// app.get("/id", function(req, res){
//     console.log("path with id");
//     res.send("loading resources");
//     //res.sendFile(path.join(__dirname, "index.html"));
// });

server.listen(3000, "0.0.0.0", function(){
    console.log("Example app listening on port 3000!\n");
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