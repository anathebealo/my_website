L.mapbox.accessToken = 'pk.eyJ1IjoiYW5hdGhlYmVhbG8iLCJhIjoiY2lzMTNnODIwMDY5MzJ6cDZ4a3pqZzQwcyJ9.y_dlJWnavIKRQ8OrdROr8Q';

var mapCluster = L.mapbox.map('map-cluster-copenhagen')
  .setView([55.821774, 12.378587], 10)
  .addLayer(L.mapbox.tileLayer('mapbox.streets'));

//mapCluster.scrollWheelZoom.disable();

L.mapbox.featureLayer()
    .loadURL('copenhagen.geojson')
    .on('ready', function(e) {
	    var clusterGroup = new L.MarkerClusterGroup();
	    e.target.eachLayer(function(layer) {
	    	layer.bindPopup("<p>" + layer.feature.properties.popupContent + "</p>")
	        clusterGroup.addLayer(layer);
	  	});

	mapCluster.addLayer(clusterGroup);
});

L.mapbox.featureLayer()
	.loadURL('ireland.geojson')
    .on('ready', function(e) {
	    var irelandClusterGroup = new L.MarkerClusterGroup();
	    e.target.eachLayer(function(layer) {
	    	layer.bindPopup("<p>" + layer.feature.properties.popupContent + "</p>")
	        irelandClusterGroup.addLayer(layer);
	  	});

	mapCluster.addLayer(irelandClusterGroup);
});

document.getElementById('copenhagen').addEventListener('click', function () {
    //mapCluster.panTo(new L.LatLng(55.821774, 12.378587), {animate: true, duration: 5.0});
    mapCluster.setView(new L.LatLng(55.821774, 12.378587), 10);

	$("#info").html("<h3> Places I visited in Copenhagen</h3> <ul> <? php include ('header.php'); ?></ul>")

    return false;
});

function gotData(responseText) {
	document.getElementById("info").html("<h3> Places I visited</h3> <ul>" + responseText + "</ul>")
}

document.getElementById('ireland').addEventListener('click', function () {
    mapCluster.setView(new L.LatLng(53.3498, -6.2603), 10);
});

function zoom_to(lat, long) {
	mapCluster.setView(new L.LatLng(lat, long), 17);
}


