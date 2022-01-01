var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var fs = require('fs');
var path = require('path');
const csv = require('fast-csv');

var bus_routes = [];
    
fs.createReadStream(path.resolve(__dirname, 'routes.txt'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => { 
        if (row.route_type === '3') 
            bus_routes.push( row.route_id);
        } )
    .on('end', rowCount => { console.log(bus_routes); console.log(`Parsed ${rowCount} rows`); });

var requestSettings = {
  method: 'GET',
  url: 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions',
  encoding: null
};

function saveFeed() {
    request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    /*    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);

        current_buses = [];
        feed.entity.forEach(entity => {
            if (bus_routes.includes(entity.vehicle.trip.routeId))
            {
              current_buses.push(entity);
            }
          });

        var json = JSON.stringify(current_buses);//feed);
*/
        let date_ob = new Date();

        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        // current hours
        let hours = ("0" + date_ob.getHours()).slice(-2);
        // current minutes
        let minutes = ("0" + date_ob.getMinutes()).slice(-2);
        // current seconds
        let seconds = ("0" + date_ob.getSeconds()).slice(-2);

        var folder = "D:/translink/" + year + month + date + "/" + hours + "/";

        if (!fs.existsSync(folder))
          fs.mkdirSync(folder, { recursive: true });

        var filename = folder + minutes + seconds + ".pb";
        fs.writeFile(filename.toString(), body, 'utf8', () => {console.log('Written: ' + filename)});
    }
    });
}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function run()
{
 // await sleep(60000 * 60 * 4);
  
  saveFeed();

  setInterval( saveFeed, 10000 );
}

run();
