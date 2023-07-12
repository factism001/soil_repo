(function (L, document) {
    // Map initialization 
    var map = L.map('map').setView([2.2655324, 23.5914665], 1);

    //osm layer
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    //osm.addTo(map);
    
   // ESRI map layer
   var esri = L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
	   maxZoom: 20, 
	   attribution: '&copy; Esri &mdash; Sources: Esri, CNES/Airbus DS, USDA'
   });
   esri.addTo(map);

// Google satellite layer
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{ 
  maxZoom: 20, 
  subdomains:['mt0','mt1','mt2','mt3']
});
    // Google streets Layer
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{ 
  maxZoom: 20, 
  subdomains:['mt0','mt1','mt2','mt3']
});

// Define the base layer
var baseLayers = {
    "EsriMap": esri, 
    "Openstreet": osm, 
    "Satellite":googleSat, 
    "Google Map":googleStreets
};

// Add layer control to the map
L.control.layers(baseLayers).addTo(map);

    
// Check if geolocation is supported
if (!navigator.geolocation) {
        console.log("Your browser doesn't support the geolocation feature!");
    } else {
        // Get the current position every minute
	setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPosition);
        }, 60000);
    }

    var marker, circle;

    function getPosition(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var accuracy = position.coords.accuracy;

        // Remove existing marker and circle from the map
	if (marker) {
            map.removeLayer(marker);
        }

        if (circle) {
            map.removeLayer(circle);
        }

        // Create marker and circle with current position
	marker = L.marker([lat, long]);
        circle = L.circle([lat, long], { radius: accuracy });

        var featureGroup = L.featureGroup([marker, circle]).addTo(map);

        // Fit themap to the bound of the feature group
	map.fitBounds(featureGroup.getBounds());

        console.log("Your coordinates are: Lat: " + lat + " Long: " + long + " Accuracy: " + accuracy);
    }

    // Define the unit of the polygon measurements
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
        // Display measurement results as JSON string in the 'eventoutput' element
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


    // Define position of map search control
    var searchControl = L.control({ position: "bottomright" });

    // Display the map search element
    searchControl.onAdd = function () {
        var container = L.DomUtil.create("div", "leaflet-control-search");

        container.innerHTML = '<input type="text" placeholder="Lati, Long (7.501326, 4.058810)">' +
            '<button id="search-btn">Search</button>';

        L.DomEvent.disableClickPropagation(container);

        return container;
    };

    searchControl.addTo(map);
    

    function searchCoordinates() {
        // Define set coordinate search control input box
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

    // Create the coordinates search button
    var searchButton = document.getElementById("search-btn");
    searchButton.addEventListener("click", searchCoordinates);
})(L, document);
