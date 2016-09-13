L.mapbox.accessToken = 'pk.eyJ1IjoiYW5hdGhlYmVhbG8iLCJhIjoiY2lzMTNnODIwMDY5MzJ6cDZ4a3pqZzQwcyJ9.y_dlJWnavIKRQ8OrdROr8Q';

var mapCluster = L.mapbox.map('map-cluster-copenhagen')
  .setView([55.821774, 12.378587], 4)
  .addLayer(L.mapbox.tileLayer('mapbox.streets'));

//mapCluster.scrollWheelZoom.disable();

L.mapbox.featureLayer()
    .loadURL('markers.geojson')
    .on('ready', function(e) {
	    var clusterGroup = new L.MarkerClusterGroup();
	    e.target.eachLayer(function(layer) {
	    	layer.bindPopup("<p>" + layer.feature.properties.popupContent + "</p>")
	        clusterGroup.addLayer(layer);
	  	});

	mapCluster.addLayer(clusterGroup);
});

function showList(country) {
	$.ajax({
	    url      : 'header.php',
	    data     : {ID:country},
	    datatype : 'json',
	    type     : 'post',
	    success  : function(Result){
            var myObj = $.parseJSON(Result);
            var infoText = "";
        	for(var i = 0; i < myObj.length; i++) {
				var obj = myObj[i];
				console.log(obj);
				infoText += "<li> <a onclick='zoom_to(" + obj.lat + "," + obj.long + ")'>" + obj.name + "</a> </li>";
			}
			//console.log(infoText);
			$("#info").html("<h3> Places I visited in " + country +  " </h3> <ul> " + infoText + "</ul>")
        }
	});
}

document.getElementById('copenhagen').addEventListener('click', function () {
    showList("Denmark");
    mapCluster.setView(new L.LatLng(55.821774, 12.378587), 10);
	// $.ajax({
	//     url      : 'json.php',
	//     datatype : 'json',
	//     type     : 'get',
	//     success  : function(Result){
	//     	//console.log($.parseJSON(Result));
	//     	console.log(Result);
 //        }
	// });
    return true;
});

function gotData(responseText) {
	document.getElementById("info").html("<h3> Places I visited</h3> <ul>" + responseText + "</ul>")
}

document.getElementById('ireland').addEventListener('click', function () {
	showList("Ireland");
	mapCluster.setView(new L.LatLng(53.4129, -8.2439), 7);
    return true;
});

function zoom_to(lat, long) {
	mapCluster.setView(new L.LatLng(lat, long), 17);
}


