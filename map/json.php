<?php
	$configFile = fopen("configuration.txt", "r") or die("unable to open file");
	$username = trim(fgets($configFile));
	$password = trim(fgets($configFile));
	fclose($configFile);

	try {
	    $conn = new PDO("mysql:host=localhost;dbname=anabapjd_maps", $username, $password);
	    
		$statement = $conn->prepare("SELECT * FROM locations NATURAL JOIN (SELECT * FROM markers NATURAL JOIN markerAssignments) AS marks;");
		$statement->execute();
		$featuresArray = array();

		while($row = $statement->fetch()) {
			$name = $row['name'];
			$markerColor = $row['color'];
			$marker = $row['markerName'];
			$line = $row['lineColor'];
			$desc = $row['description'];
			$lat = $row['latitude'];
			$long = $row['longitude'];

			$propertyArray = array("name" => $name, "marker-color" => $markerColor, "marker-symbol" => $marker, "line" => $line, "popupContent" => $desc);
			$geometryArray = array('type' => 'Point', 'coordinates' => array($long, $lat));
			$tempArray = array('type' => 'Feature', 'properties' => $propertyArray, 'geometry' => $geometryArray);

			array_push($featuresArray, $tempArray);
		}

		$data = array(
		    'type' => 'FeatureCollection',
		    'crs' => array(
		    	'type' => 'name',
		    	'properties' => array(
		    		'name' => 'urn:ogc:def:crs:OGC:1.3:CRS84'
		    	)
			),
			'features' => $featuresArray
		);

		echo json_encode($data);

	    // set the PDO error mode to exception
	    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	} catch(PDOException $e) {
	    echo "Connection failed: " . $e->getMessage();
	}

	$conn = null;
?>