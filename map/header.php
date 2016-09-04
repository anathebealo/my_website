<?php
	$servername = "localhost";
	$username = "anabapjd_admin";
	$password = "Toms-gal404";
	$database = "anabapjd_maps";

	try {
	    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
	    
		$statement = $conn->prepare("SELECT * FROM locations WHERE city = :cit");
		$statement->execute(array(':cit' => "Copenhagen"));
		while($row = $statement->fetch()) {
			//echo "<li>".$row['name']."</li>";
			echo "<li><a onclick='zoom_to(".$row['latitude'].",".$row['longitude'].")'>".$row['name']."</a></li>";
		}

	    // set the PDO error mode to exception
	    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	} catch(PDOException $e) {
	    echo "Connection failed: " . $e->getMessage();
	}

	$conn = null;
?>
