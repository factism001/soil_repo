// JavaScript code for interacting with the map and retrieving user's current location
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

    // Display the coordinates on the map and zoom to the location
    // Create a new map centered on the current location
    const map = L.map("map").setView([latitude, longitude], 12);

    // Add a marker to the map at the current location
    L.marker([latitude, longitude]).addTo(map);

    // Print the location coordinates to the user
    var coordinatesMessage = "Your current location coordinates: " + latitude + ", " + longitude;
    alert(coordinatesMessage);
}

// Call the getUserLocation function when the page is loaded
window.addEventListener("load", getUserLocation);

