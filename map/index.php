<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8 />
  <title></title>
  <link href="https://fonts.googleapis.com/css?family=Lora|Lato" rel="stylesheet">
  <script src='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js'></script>
  <link href='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css' rel='stylesheet' />
  <script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js'></script>
  <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css' rel='stylesheet' />
  <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css' rel='stylesheet' />
  <link href='stylesheet.css' rel='stylesheet' />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"> </script>
</head>

<body>
	<div> 
		<h1> Places I have been </h1>
		<hr>
	</div>
	<div class="map">
		<div id='map-cluster-copenhagen' class='map-copenhagen'></div>
	</div>
	<div id="cop">
		<div id="buttons">
			<button id="copenhagen">Denmark</button>
			<button id="ireland">Ireland</button>
		</div>
		<div id='info'>
			
   		</div>
	</div>
	<script> L.mapbox.accessToken = 'pk.eyJ1IjoiYW5hdGhlYmVhbG8iLCJhIjoiY2lzMTNnODIwMDY5MzJ6cDZ4a3pqZzQwcyJ9.y_dlJWnavIKRQ8OrdROr8Q'; </script>
	<script src='script.js'></script>

</body>
</html>
