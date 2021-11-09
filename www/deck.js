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
  { name: 'Very Poor', range: 100, color: [0, 0, 0] }
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

const DATA_URL = 'http://localhost:8000/buspositions';

let newData = false;

var scatterLayer =  new ScatterplotLayer({
  data: GetJSON(DATA_URL),
  radiusScale: 5,
  radiusMinPixels: 2,
  colorRange: PM25_COLOURS,
  getColorWeight: d => d.pm25,
  getPosition: d =>  [d.position.longitude, d.position.latitude, 0],// [d.vehicle.position.longitude, d.vehicle.position.latitude, 0],
  pickable: true/*,
  transitions: {
    getPosition: 2000
  }*/
});

/** DeckGL **/
const busDeck = new DeckGL({
    mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
 //   mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  getTooltip: ({object}) => object && {
    html: `<h5>Route: ${object.route}</h5>
    <div>PM2.5: ${object.pm25}</div>
    <div>Longitude: ${object.position.longitude}</div>
    <div>Latitude: ${object.position.latitude}</div>`,
  },
  container: 'map-container',
  layers: [ scatterLayer
   /*,
    new HeatmapLayer({
      id: 'heatmapLayer',
      data: 'http://localhost:8000/buspositions',
      getPosition: d => [d.vehicle.position.longitude, d.vehicle.position.latitude, 0],
      getWeight: d => 1.0
    })/*,

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
    })*/
  ]
});

setInterval(() => {
  scatterLayer =  new ScatterplotLayer({
    data: GetJSON(DATA_URL),
    radiusScale: 5,
    radiusMinPixels: 5,
    colorRange: PM25_COLOURS,
    getColorWeight: d => d.pm25,
    getPosition: d => [d.position.longitude, d.position.latitude, 0],
    pickable: true/*,
    transitions: {
      getPosition: 2000
    }*/
  });

  busDeck.setProps({layers: [scatterLayer]});
 // console.log('Updating data');
}, 10 * 1000);