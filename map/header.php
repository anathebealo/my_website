<?php
	$configFile = fopen("configuration.txt", "r") or die("unable to open file");
	$servername = trim(fgets($configFile));
	$username = trim(fgets($configFile));
	$password = trim(fgets($configFile));
	$database = trim(fgets($configFile));
	fclose($configFile);

	$cntry = $_POST['ID'];
	try {
	    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
	    
		$statement = $conn->prepare("SELECT * FROM locations WHERE country = :country");
		$statement->execute(array(':country' => $cntry));
		$jsonObject = array();
		while($row = $statement->fetch()) {
			array_push($jsonObject, array('lat' => $row['latitude'], 'long' => $row['longitude'], 'name' => $row['name']));
		}
		echo json_encode($jsonObject);
	    // set the PDO error mode to exception
	    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	} catch(PDOException $e) {
	    echo "Connection failed: " . $e->getMessage();
	}

	$conn = null;
?>
