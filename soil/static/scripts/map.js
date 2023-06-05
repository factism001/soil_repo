// JavaScript code for interacting with the map and retrieving user's current location
/*var map = L.map('map').fitWorld();*/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var map = L.map('map', {
       layers: [osm] // only add one!
	    }).fitWorld();
        /*.setView([-41.2858, 174.78682], 14);*/

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    var singleMarker = L.marker(e.latlng).addTo(map)
        .bindPopup("Your location coordinates are: " + e.latlng + "and you are" + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

map.on('locationfound', onLocationFound);


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showUserLocation);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showUserLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

// Print the location coordinates to the user
    var coordinatesMessage = "Your current location coordinates: " + latitude + ", " + longitude;
    alert(coordinatesMessage);
}

// Call the getUserLocation function when the page is loaded
window.addEventListener("load", getUserLocation);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng
.toString())
        .openOn(map);
}
                                                        map.on('click', onMapClick);

/*var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
attribution: '© OpenStreetMap contributors © CARTO',
subdomains: 'abcd',
	maxZoom: 19
});
CartoDB_DarkMatter.addTo(map);*/

// Google Map Layer

googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
 });

// Satelite Layer
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3']
 });

/*var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
 attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap contributors',
subdomains: 'abcd',
minZoom: 1,
maxZoom: 16,
ext: 'jpg'
});
Stamen_Watercolor.addTo(map);*/

var baseLayers = {
    "Satellite":googleSat,
    "Google Map":googleStreets,
    "OpenStreetMap": osm
};

/*var overlays = {
    "Marker": singleMarker
};*/
L.control.layers(baseLayers).addTo(map);

/*var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);*/

/*var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
   polygon: {
     shapeOptions: {
       color: 'purple'
     },
   },
   polyline: {
     shapeOptions: {
       color: 'red'
     },
   },
   rect: {
     shapeOptions: {
       color: 'green'
     },
   },
   circle: {
     shapeOptions: {
       color: 'steelblue'
     },
   },
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
	var type = e.layerType, 
		layer = e.layer;
	drawnItems.addLayer(layer);
});*/
