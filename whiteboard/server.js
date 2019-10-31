const express = require("express");

const app = express();

const http = require("http").Server(app);

//const router = express.Router();

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.get("/#/", function(req, res, next) {
    console.log("default path");
    res.send("default path");
});

app.get("/#/:id", function(req, res, next){
    console.log("path with id");
    res.send("path with id");
});

http.listen(3000, "0.0.0.0", function(){
    console.log("Example app listening on port 3000!\n");
});

const io = require("socket.io")(http);

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