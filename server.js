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

const url = "mongodb://127.0.0.1:27017/up2nativedb";
const params = { useUnifiedTopology: true, useNewUrlParser: true };
mongo.connect(url, params, function(err, client){
    console.log("connected");
    var db = client.db("up2nativedb");
    var sheets = db.collection("sheets").find();
    sheets.each(function(err, docs){
        console.log(docs);
    });
    client.close();
});

io.on("connection", function(socket){
    console.log("user connected");

    socket.on("create", function(settings){
        console.log("created sheet " + settings.id);
    });

    socket.on("update", function(data){
        console.log("update " + data);
        io.emit("update", data);
    });

    socket.on("disconnect", function(){
        console.log("user disconnected");
    });
});