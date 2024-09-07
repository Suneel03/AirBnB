
mapboxgl.accessToken = mapToken; 
// this maptoken came from show.ejs = process.env.MAP_TOEN 


const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(listing.geometry.coordinates)

const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
.setPopup(new mapboxgl.Popup( {offset: 25})
.setHTML(`<h4>${listing.title} </h4>
     <p>Exact location will be provided after booking</p>`))
.addTo(map);



