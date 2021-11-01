const {DeckGL, PathLayer, ScatterplotLayer, TripLayer, HeatmapLayer, HexagonLayer} = deck;

function GetJSON(yourUrl){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",yourUrl,false);
  Httpreq.send(null);
  return JSON.parse(Httpreq.responseText);          
}

const INITIAL_VIEW_STATE = {
  latitude: -27.4705,
  longitude: 153.0260,
  zoom: 16,
  minZoom: 5,
  maxZoom: 20
};

const PM2_RANGE = [ 
  { name: 'Very Good', range: 8.2, color: [0, 128, 255] },
  { name: 'Good', range: 16.4, color: [128, 255, 255] },
  { name: 'Fair', range: 25, color: [255, 255, 128] },
  { name: 'Poor', range: 37.4, color: [255, 128, 0] },
  { name: 'Very Poor', range: 37.5, color: [0, 0, 0] }
];

const PM25_COLOURS = [ 
  [0, 128, 255] ,
   [128, 255, 255] ,
   [255, 255, 128] ,
  [255, 128, 0]
];

function getMax(points) {
  return points.reduce((max, p) => (p.pm25 / 50.0) > max ? (p.pm25 / 50.0) : max, 0);//-Infinity);
}

const COLOR_RANGE = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

console.log(GetJSON('http://localhost:8000/buspositions'));

/** DeckGL **/
new DeckGL({
  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  getTooltip: ({object}) => object && (object.name || object.locationstring || object.groupname),
  container: 'map-container',
  layers: [
    new ScatterplotLayer({
      id: 'bus-scatter',
      data: GetJSON('http://localhost:8000/buspositions'),//https://raw.githubusercontent.com/conanb/datasets/main/busstops.json',
      radiusScale: 10,
      radiusMinPixels: 5,
      getPosition: d => [d.vehicle.position.longitude, d.vehicle.position.latitude, 0],//[d.latitude, d.longitude, 0],
      getFillColor: [0,0,0],
      getLineColor: [0,0,0],
      pickable: true,
      autoHighlight: true
    })/*,


    new HeatmapLayer({
      id: 'heatmapLayer',
      data: 'https://raw.githubusercontent.com/conanb/datasets/main/busstops.json',
      getPosition: d => [d.latitude, d.longitude, 0],
      getWeight: d => d.pm25 / 50.0,
  //    getWeightValue: getMax,
 //     getColorWeight: d => d.pm25 / 50.0,
  //    aggregation: 'MEAN',
     colorRange: COLOR_RANGE,//PM25_COLOURS,
      radiusPixels: 100
    }),

    new HexagonLayer({
      id: 'heatmap',
      radius: 5,
      coverage: 1,
      colorRange: COLOR_RANGE,//PM25_COLOURS,
      data: 'https://raw.githubusercontent.com/conanb/datasets/main/busstops.json',
      elevationRange: [0, 50],
      elevationScale: 3,
      extruded: true,
    //  elevationAggregation: 'MEAN',
   //   colorAggregation: 'MEAN',
      getPosition: d => [d.latitude, d.longitude, 0],
      getElevationWeight: d => d.pm25 / 50.0,
   //   getElevationValue: getMax,
      getColorWeight: d => d.pm25 / 50.0,
      opacity: 1
    }),

    new ScatterplotLayer({      
      id: 'scatter-plot',
      data: GetJSON('http://dashboard.sensors.net.au/api/qld'),
      radiusScale: 20,
      radiusMinPixels: 20,
      getPosition: d => [d.Longitude, d.Latitude, 0],
      getColor: 
      d => (d.pm25 < PM2_RANGE[0].range ? PM2_RANGE[0].color : 
            (d.pm25 < PM2_RANGE[1].range ? PM2_RANGE[1].color : 
              (d.pm25 < PM2_RANGE[2].range ? PM2_RANGE[2].color : 
                (d.pm25 < PM2_RANGE[3].range ? PM2_RANGE[3].color : 
                  (d.pm25 < PM2_RANGE[4].range ? PM2_RANGE[4].color : [128,128,128]))))),
      pickable: true
    }),

    
    new ScatterplotLayer({      
      id: 'scatter-plot',
      data: GetJSON('http://dashboard.sensors.net.au/api/projects/Adelaide?_=1621405032059'),
      radiusScale: 20,
      radiusMinPixels: 20,
      getPosition: d => [d.Longitude, d.Latitude, 0],
      getColor: 
      d => (d.pm25 < PM2_RANGE[0].range ? PM2_RANGE[0].color : 
            (d.pm25 < PM2_RANGE[1].range ? PM2_RANGE[1].color : 
              (d.pm25 < PM2_RANGE[2].range ? PM2_RANGE[2].color : 
                (d.pm25 < PM2_RANGE[3].range ? PM2_RANGE[3].color : 
                  (d.pm25 < PM2_RANGE[4].range ? PM2_RANGE[4].color : [128,128,128]))))),
      pickable: true
    })*/
  ]
});