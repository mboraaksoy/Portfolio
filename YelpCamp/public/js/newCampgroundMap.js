maptilersdk.config.apiKey = mapTilerApiKey;

const usaCoords = [-100.8283, 38.5795];
let finalCoords = [];

async function getCoords() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.longitude, position.coords.latitude];
                resolve(userCoords);
            },
            (error) => {
                console.error("Error getting location:", error.message);
                resolve(usaCoords); // Default fallback
            },
            { enableHighAccuracy: true }
        );
    });
}

async function initializeMap() {
    finalCoords = await getCoords();
    const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element in which SDK will render the map
        style: maptilersdk.MapStyle.STREETS,
        center: finalCoords, // starting position [lng, lat]
        zoom: 3.5 // starting zoom
    });
    const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({});
    map.addControl(gc, 'top-left');
    
    const marker = new maptilersdk.Marker({
        color: '#FF0000',
        draggable: false
    })
        .setLngLat(finalCoords)
        .addTo(map);
    return { map, marker };
}

async function setLocation() {
    const { map, marker } = await initializeMap();
    map.on('click', (e) => {
        finalCoords = e.lngLat;
        marker.setLngLat(finalCoords);
        const lat = document.querySelector('#coordsLatitude');
        const lng = document.querySelector('#coordsLongitude');
        lat.value = finalCoords.lat;
        lng.value = finalCoords.lng;
    });
}

setLocation();