// JavaScript code for interacting with the map and retrieving user's current location
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

/*function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng
.toString())
        .openOn(map);
}
                                                        map.on('click', onMapClick);*/

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

var baseLayers = {
    "Satellite":googleSat,
    "Google Map":googleStreets,
    "OpenStreetMap": osm
};

L.control.layers(baseLayers).addTo(map);
