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

server.listen(process.env.PORT || 4000, function(){
    console.log("Example app listening on port 3000!\n");
});

const url = "mongodb://user_up2native:db123456789@ds353738.mlab.com:53738/heroku_gtnpx9mf";
mongo.connect(url, function(err, db){
    console.log("connected");
    var sheets = db.collection("sheets");

    io.on("connection", function(socket){
        console.log("user connected");
    
        socket.on("update", function(sheet){
            const sid = sheet.id;
            const sobjs = sheet.objs;
            console.log("update " + sheet);
            sheets.updateOne(
                {
                    id: sid
                }, 
                { 
                    $addToSet: { 
                        objs: { 
                            id: sobjs[0].id, 
                            type: sobjs[0].type
                        } 
                    } 
                },  
                { upsert: true }
            ).then(() => {
                sheets.updateOne(
                {
                    id: sid, 
                    objs: { $elemMatch: { id: sobjs[0].id } } 
                }, 
                { 
                    $addToSet: { 
                        "objs.$.deltas": { $each: sobjs[0].deltas }
                    } 
                });
            });
            io.emit("update", sheet);
        });

        socket.on("initialize", function(sheet){
            console.log("initialize " + sheet.id);
            sheets.findOne({ 
                id: sheet.id
            }).then((document) => {
                const sobjs = document.objs;
                io.emit("initialize", { id: sheet.id, objs: sobjs });
                console.log("state " + { id: sheet.id, objs: sobjs });
            });
        });
    
        socket.on("disconnect", function(){
            console.log("user disconnected");
        });
    });
});

