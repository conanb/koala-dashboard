var express = require('express');
var path = require('path');

const gtfsRt = require('gtfs-realtime-bindings');
const request = require('request');

const app = express();

const port = process.env.PORT || "8000";

//app.get("/", (req, res) => {
//        res.status(200).send("Fine, be like that!");
//  });

var requestSettings = {
    method: 'GET',
    url: 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions',
    encoding: null
};

app.get("/buspositions", (req, res) => {
    // return bus locations!
    request(requestSettings, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('response 200');
            var feed = gtfsRt.transit_realtime.FeedMessage.decode(body);
            res.status(200).send(feed.entity);
        }
        else
            res.status(200).send("{\"entity\": []}");
    });
});

app.use(express.static('www'));

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Express app listening at http://%s:%s', host, port);
});

/*const gtfsRt = require('./gtfsRtDecode');
var request = require('request');
var http = require('http');
const fs = require('fs').promises;


request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('response 200');
	let feed=gtfsRt.decode(body);
    }else{
        console.log('error or unsatisfactory status code')
    }
});

const host = 'localhost';
const port = 8080;

let indexFile;
let server;

fs.readFile(__dirname + "/deck/index.html")
    .then(contents => {
        indexFile = contents;

        server = http.createServer(requestListener);
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");
    switch (req.url)
    {
        case "/bus":
            res.writeHead(200);
            res.end(indexFile);
            break;
        default:
            res.writeHead(200);
            res.end('No man\'s land');
            break;
    }
};*/