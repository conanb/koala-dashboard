const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const gtfsRt = require('gtfs-realtime-bindings');
const request = require('request');
const noise = require('./perlin');

const port = process.env.PORT || "8000";

// open routes.txt, which is a csv
// find routes with route_type 3
// the route_id from routes.txt matches the
// vehicle.trip.routeId field
// build new dictionary of only the bus routes

var bus_routes = [];
    
fs.createReadStream(path.resolve(__dirname, 'routes.txt'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => { 
        if (row.route_type === '3') 
            bus_routes.push( row.route_id);
        } )
    .on('end', rowCount => { console.log(bus_routes); console.log(`Parsed ${rowCount} rows`); });


//app.get("/", (req, res) => {
//        res.status(200).send("Fine, be like that!");
//  });

var requestPositions = {
    method: 'GET',
    url: 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions',
    encoding: null
};
/*
var requestPositions = {
    method: 'GET',
    url: 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions',
    encoding: null
};

// dump 
request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var feed = gtfsRt.transit_realtime.FeedMessage.decode(body);
        fs.writeFile('D:/_masters/koala-dashboard/positions.json', feed);
    }
    else
        console.log('unable to read positions');
});
*/

var combined_buses = [];

var current_buses = [];
var previous_buses = [];

const app = express();

function gatherBusData() {
// return bus locations!
    request(requestPositions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('gathering bus data');
            var feed = gtfsRt.transit_realtime.FeedMessage.decode(body);
            current_buses = [];
            feed.entity.forEach(entity => {
                if (bus_routes.includes(entity.vehicle.trip.routeId))
                {
                    var n = noise.noise.perlin2(
                        entity.vehicle.position.longitude * 50, 
                        entity.vehicle.position.latitude * 50) * 0.5 + 0.5;

                    var old_bus = previous_buses.find(e => e.route == entity.vehicle.trip.routeId);

                    var entry = {
                        route: entity.vehicle.trip.routeId,
                        timestamp: entity.vehicle.timestamp,
                        pm25: n ? Math.pow(n, 2) * 40 : 0,
                        position: {
                            latitude: entity.vehicle.position.latitude,
                            longitude: entity.vehicle.position.longitude,
                        },
                        previous_position: {
                            latitude: old_bus ? old_bus.position.latitude : 0,
                            longitude:  old_bus ? old_bus.position.longitude : 0
                        }
                    };

                    current_buses.push(entry);
                    combined_buses.push(entry);
                }
            });

            current_buses.sort((a, b) => { (a.route < b.route ? -1 : (a.route > b.route ? 1 : 0)) });
            previous_buses = current_buses;
        }
        else
            console.log('failed to gather bus data');
    });
}

app.get("/buspositions", (req, res) => {
    gatherBusData();
    res.status(200).send(current_buses);
});

app.get("/alldata", (req, res) => {
    gatherBusData();
    res.status(200).send(combined_buses);
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