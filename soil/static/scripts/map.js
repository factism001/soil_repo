(function (L, document) {
    // Map initialization 
    var map = L.map('map').setView([14.0860746, 100.608406], 6);

    //osm layer
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    //osm.addTo(map);
    
var esri = L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
  minZoom: 14, 
  maxZoom: 20, 
  attribution: '&copy; Esri &mdash; Sources: Esri, CNES/Airbus DS, USDA'
});
esri.addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{ 
  maxZoom: 20, 
  subdomains:['mt0','mt1','mt2','mt3']
});
    // Google Map Layer
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{ 
  maxZoom: 20, 
  subdomains:['mt0','mt1','mt2','mt3']
});

var baseLayers = {
    "EsriMap": esri, 
    "Openstreet": osm, 
    "Satellite":googleSat, 
    "Google Map":googleStreets
};
L.control.layers(baseLayers).addTo(map);

    if (!navigator.geolocation) {
        console.log("Your browser doesn't support the geolocation feature!");
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPosition);
        }, 60000);
    }

    var marker, circle;

    function getPosition(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var accuracy = position.coords.accuracy;

        if (marker) {
            map.removeLayer(marker);
        }

        if (circle) {
            map.removeLayer(circle);
        }

        marker = L.marker([lat, long]);
        circle = L.circle([lat, long], { radius: accuracy });

        var featureGroup = L.featureGroup([marker, circle]).addTo(map);

        map.fitBounds(featureGroup.getBounds());

        console.log("Your coordinates are: Lat: " + lat + " Long: " + long + " Accuracy: " + accuracy);
    }

    var measureControl = L.control.measure({
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        primaryAreaUnit: 'hectares',
        secondaryAreaUnit: 'sqmeters',
    });

    measureControl.addTo(map);

    map.on('measurefinish', function(evt) {
        writeResults(evt);
        });
            function writeResults(results) {
        document.getElementById('eventoutput').innerHTML = JSON.stringify(
          {
            area: results.area,
            areaDisplay: results.areaDisplay,
            lastCoord: results.lastCoord,
            length: results.length,
            lengthDisplay: results.lengthDisplay,
            pointCount: results.pointCount,
            points: results.points
          },
          null,
          2
        );
        }


    var searchControl = L.control({ position: "bottomright" });

    searchControl.onAdd = function () {
        var container = L.DomUtil.create("div", "leaflet-control-search");

        container.innerHTML = '<input type="text" placeholder="Latitude, Longitude">' +
            '<button id="search-btn">Search</button>';

        L.DomEvent.disableClickPropagation(container);

        return container;
    };

    searchControl.addTo(map);
    

    function searchCoordinates() {
        var input = document.querySelector(".leaflet-control-search input").value;
        var coordinates = input.split(",");

        if (coordinates.length === 2) {
            var lat = parseFloat(coordinates[0]);
            var lng = parseFloat(coordinates[1]);

            if (!isNaN(lat) && !isNaN(lng)) {
                map.setView([lat, lng], 16);
                L.marker([lat, lng]).addTo(map);
            } else {
                alert("Invalid coordinates!");
            }
        } else {
            alert("Invalid coordinates!");
        }
    }

    var searchButton = document.getElementById("search-btn");
    searchButton.addEventListener("click", searchCoordinates);
})(L, document);
