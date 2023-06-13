// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize the feature group to store drawn items
var drawnItems = new L.FeatureGroup().addTo(map);

// Define the draw control options
var drawControlOptions = {
  draw: {
    polyline: false,
    circlemarker: false,
    marker: false,
    circlemarker: false,
    polygon: {
      allowIntersection: false,
      showArea: true
    }
  },
  edit: {
    featureGroup: drawnItems
  }
};

// Add the draw control to the map
var drawControl = new L.Control.Draw(drawControlOptions).addTo(map);

// Event handler for drawing created
map.on('draw:created', function(e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);

  // Calculate and display the area of the drawn polygon
  var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
  alert("Area: " + area.toFixed(2) + " square meters");
});

// Event handler for draw deleted
map.on('draw:deleted', function(e) {
  drawnItems.clearLayers();
});

