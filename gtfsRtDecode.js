const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

function decode(buffer){
    console.log('decode...');

    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);
    if(feed){
        console.log('feed: %s',feed)
	let header=feed.header;
	if(header){
	    console.log('header: %s',header)
	    let gtfsRealtimeVersion=header.gtfsRealtimeVersion;
	    if(gtfsRealtimeVersion){
            console.log('gtfsRealtimeVersion: %s',gtfsRealtimeVersion)
	    }
	}
	feed.entity.forEach(function(entity) {
	    if (entity.tripUpdate) {
            console.log('tripUpdate')
		const tripUpdate=entity.tripUpdate;
		if(tripUpdate.trip){
		    console.log('TripDescriptor')
		    const trip=tripUpdate.trip
		    if(trip.tripId){
                console.log('trip_id: %s',trip.tripId)
		    }
		    if(trip.routeId){
                console.log('route_id: %s',trip.routeId)
		    }
		    if(trip.directionId){
                console.log('direction_id: %s',trip.directionId)
		    }
		    if(trip.startTime){
                console.log('start_time: %s',trip.startTime)
		    }
		    if(trip.startDate){
                console.log('start_date: %s',trip.startDate)
		    }
		    if(trip.scheduleRelationship){
                console.log('schedule_relationship: %s',trip.scheduleRelationship)
		    }
		}
		if(tripUpdate.vehicle){
		    console.log('VehicleDescriptor')
		}
		if(tripUpdate.timestamp){
		    console.log('timestamp: %s',tripUpdate.timestamp)
		}
	    }else if(entity.vehicle){
		const vehPos=entity.vehicle;
	//	console.log('vehiclePosition')
		if(vehPos.position){

            console.log('Vehicle: ' + vehPos.vehicle.label + ' - Pos: [ ' + vehPos.position.latitude + ', ' + vehPos.position.longitude + ' ]' );

		//    const pos=vehPos.position;
		//    console.log('position')
		//    if(pos.latitude){
		//	const lat=pos.latitude;
		//	console.log('lat: %s',lat)
		//    }
		  //  if(pos.longitude){
		//	const lon=pos.longitude;
		//	console.log('lon: %s',lon)
		//    }
		}
	    }else if(entity.alert){
            console.log('alert')
	    }else{
            console.log('entity unknown')
	    }
	});
	// Verify the payload if necessary (i.e. when possibly incomplete or invalid)
	let errMsg = GtfsRealtimeBindings.transit_realtime.FeedMessage.verify(feed);
	if (errMsg){
	    console.log('msg invalid')
	    throw Error(errMsg);
	}else{
	    console.log('msg valid')
	}
    }else{
        console.log('feed unavailable')
    }
    console.log('...done.')
    return feed;
}
module.exports = {decode}
