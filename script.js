
// CRS setup Taken from https://gis.stackexchange.com/questions/200865/leaflet-crs-simple-custom-scale
//0.03125
var factorx = 0.032
var factory = 0.032

L.CRS.pr = L.extend({}, L.CRS.Simple, {
  projection: L.Projection.LonLat,
  transformation: new L.Transformation(factorx, 0, -factory, 0),
  // Changing the transformation is the key part, everything else is the same.
  // By specifying a factor, you specify what distance in meters one pixel occupies (as it still is CRS.Simple in all other regards).
  // In this case, I have a tile layer with 256px pieces, so Leaflet thinks it's only 256 meters wide.
  // I know the map is supposed to be 2048x2048 meters, so I specify a factor of 0.125 to multiply in both directions.
  // In the actual project, I compute all that from the gdal2tiles tilemapresources.xml, 
  // which gives the necessary information about tilesizes, total bounds and units-per-pixel at different levels.


// Scale, zoom and distance are entirely unchanged from CRS.Simple
  scale: function(zoom) {
    return Math.pow(2, zoom);
  },

  zoom: function(scale) {
    return Math.log(scale) / Math.LN2;
  },

  distance: function(latlng1, latlng2) {
    var dx = latlng2.lng - latlng1.lng,
      dy = latlng2.lat - latlng1.lat;

    return Math.sqrt(dx * dx + dy * dy);
  },
  infinite: true
});

// Map
var map = L.map('map', {
  crs: L.CRS.pr
}).setView([-4096,4096], 2);

var mapheight = 8192;
var mapwidth = 8192;
var sw = map.unproject([0, mapheight], 2);
var ne = map.unproject([mapwidth, 0], 2);
var layerbounds = new L.LatLngBounds(sw, ne);


var setLayers = function(name) {
  return L.tileLayer(`maps/${name}/{z}/{x}/{y}.png`,
      {
      minZoom: 2,
      maxZoom: 5,
      bounds: layerbounds,
      tms: false,
      })
};

var deston = setLayers('deston');
var erangel = setLayers('erangel');
var miramar = setLayers('miramar');
var rondo = setLayers('rondo');
//var sanhok = setLayers('sanhok');
var taego = setLayers('taego');
var vikendi = setLayers('vikendi');


var baseMaps = {
  "Deston": deston,
  "Erangel": erangel,
  "Miramar": miramar,
  "Rondo": rondo,
  //"Sanhok": sanhok,
  "Taego": taego,
  "Vikendi": vikendi
};

var layerControl = L.control.layers(baseMaps).addTo(map);

// Drawing Tool
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        marker: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        },
         edit: false
     });
map.addControl(drawControl);