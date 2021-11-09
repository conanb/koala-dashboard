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

const COLOR_RANGE = [
  [0, 128, 255] ,
   [128, 255, 128] ,
   [255, 128, 128] ,
  [255, 128, 0]
];

var data = GetJSON('http://localhost:8000/alldata');

let newData = false;

const busDeck = new DeckGL({
//  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  getTooltip: ({object}) => object && {
    html: `<div>PM2.5: ${object.length}</div>
    <div>Longitude: ${object.position.longitude}</div>
    <div>Latitude: ${object.position.latitude}</div>`,
  },
  container: 'map-container'
});

const OPTIONS = ['radius', 'coverage'];

OPTIONS.forEach(key => {
  console.log(key);
  var elem = document.getElementById(key);
  console.log(elem);

  elem.oninput = renderLayer;
});

renderLayer();

function renderLayer() {

  const options = {};

  OPTIONS.forEach(key => {
    const value = +document.getElementById(key).value;
    document.getElementById(key + '-value').innerHTML = value;
    options[key] = value;
  });

  const hexLayer = new HexagonLayer({
    id: 'heatmap',
 //   colorRange: COLOR_RANGE,
    data: data,
    elevationRange: [0, 500],
 //   elevationScale: 2,
    extruded: true,
    elevationAggregation: 'MAX',
    colorAggregation: 'MAX',
    getPosition: d => [d.position.longitude, d.position.latitude, 0],
    getElevationWeight: d => d.pm25,
    getColorWeight: d => d.pm25,
//    pickable: true,
    opacity: 1,
    ...options
    });

    busDeck.setProps({ layers: [ hexLayer] });
}

setInterval(() => {
  
  data = GetJSON('http://localhost:8000/alldata');
  renderLayer();
  
}, 30 * 1000);