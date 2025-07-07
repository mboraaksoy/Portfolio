maptilersdk.config.apiKey = mapTilerApiKey;

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: campgroundCoordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
});

const marker = new maptilersdk.Marker({
    color: '#FF0000',
    draggable: false
})
    .setLngLat(campgroundCoordinates)
    .addTo(map);