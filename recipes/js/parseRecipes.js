var recbase = window.location.search.substring(1);
recbase = recbase.replace('?', '');
getData(recbase);

// getting information from txt files ------------------------------------------------------------------------------------------|
function getData(recipeUrl) {
	jQuery.get("txtRecipes/" + recipeUrl + ".txt", function(data) {
		parseData(data);
	});
}


// parsing text file data ------------------------------------------------------------------------------------------------------|
//parsing setup file data -------------------------------------------------------------------------------------|
function parseData(data) {
	//also gets rid of windows newline char at end, gr
	var recipeLines = data.split("\n").map(function(line){ return line.replace('\r', '')});
	
	if(recipeLines[0] === "title") {
		document.getElementById("title").innerHTML = "<h1>" + recipeLines[1] + "</h1>";
	}

	//date
	if(recipeLines[2] === "date") {
		document.getElementById("date").innerHTML =  "<p>" + recipeLines[3] + "</p>";
	}

	//source
	if(recipeLines[4] === "source") {
		document.getElementById("source").innerHTML =  "<p><strong>Source</strong>:" + recipeLines[5] + "</p>";
	}

	//photo
	var ingredients_start = 7;
	var images_section = recipeLines[6].split(",");
	if(images_section[0] === "photo") {
		var list_of_images = [];
		var num_of_images = parseInt(images_section[1]);
		for(var l = 0; l<num_of_images; l++) {
			list_of_images.push(recipeLines[7 + l]);
			ingredients_start++;
		}
		console.log(ingredients_start);
		console.log(recipeLines[ingredients_start]);
		document.getElementById("photo").innerHTML =  "<img src='" + list_of_images[0] +"'>";
	}

	//ingredients recipeLines[8]
	var direction_start_index = ingredients_start+2;
	if(recipeLines[ingredients_start] === "ingredients") {
		var ingredient_list = "<p>INGREDIENTS</p>";
		var ingredient_outline = recipeLines[ingredients_start+1].split(",");
		if(ingredient_outline.length > 1 ) { //this means there are 'subtype' ingredient lists
			var count = 0;
			for(var j = 0; j<parseInt(ingredient_outline[0]); j++) {
				var current_list = ingredient_outline[j+1].split(" "); //[Crust, 3]

				ingredient_list += "<strong>" + current_list[0] + "</strong>";
				ingredient_list += "<ul>";
				for(var i = 0; i<parseInt(current_list[1]); i++) {
					var current_ingredient = recipeLines[10+count].split(",");
					if(current_ingredient.length === 2) {
						ingredient_list += "<li><strong>" + current_ingredient[0] + "</strong> " + current_ingredient[1] + "</li>";
					} else {
						ingredient_list += "<li>" + current_ingredient[0] + "</li>";
					}
					direction_start_index++;
					count++;
				}
				ingredient_list += "</ul>"
			}
		} else { //just one list of ingredients
			ingredient_list += "<ul>";
			for(var i = 0; i<parseInt(ingredient_outline[0]); i++) {
				var current_ingredient = recipeLines[10+i].split(",");
				if(current_ingredient.length === 2) {
					ingredient_list += "<li><strong>" + current_ingredient[0] + "</strong> " + current_ingredient[1] + "</li>";
				} else {
					ingredient_list += "<li>" + current_ingredient[0] + "</li>";
				}
				direction_start_index++;
			}
			ingredient_list += "</ul>"
		}

		document.getElementById("ingredients").innerHTML = ingredient_list;
	}

	//directions
	if(recipeLines[direction_start_index] === "directions") {
		var directions_list = "<p>DIRECTIONS</p><ol>";
		for(var k = direction_start_index+1; k<recipeLines.length; k++) {
			directions_list+="<li>" + recipeLines[k] + "</li>";
		}
		directions_list+="</ol>"
		document.getElementById("directions").innerHTML = directions_list;
	}
	makeThumbnail("blah")
}

function makeThumbnail(name_of_file) {
	var recipes = {};
	jQuery.get("txtRecipes/setup.txt", function(data) {
		recipes = get_recipes(data);
		console.log(recipes);
		//Creating the sidebar thumbnails
		var sidebar_list = "<button id='sidebar_butt' onclick='location.href=\"http://www.anabealo.com/recipes/recipe_tags.html\"'>All Recipes</button>";
		var onclick = "";
		for(var recipe_base in recipes) {
			onclick = "getData('" + recipe_base + "')";
			sidebar_list += "<div class='sidebar_thumbnail' onclick=\"" + onclick + "\">";
			sidebar_list += "<p>" + recipes[recipe_base].string_name + "</p> <img src=\"images/" + recipe_base + ".jpg\">"; 
			sidebar_list+="</div>";
		}

		console.log(sidebar_list);
		document.getElementById("sidebar_container").HTML += sidebar_list;
	});
}

function get_recipes(data, recipes) {
	var recipes = {};
	var tagLines = data.split("\n").map(function(line){ return line.replace('\r', '')});
	//console.log(tagLines);
	var recipe_base = "";
	var recipe_name_and_base = "";
	var tag_name = "";
	var tags = {};
	var tag_lines_count = 1;
	//grab all info and put it into recipes array -- each recipe is an index
	//console.log(parseInt(tagLines[0].split(" ")[1]));
	for(var a = 0; a<parseInt(tagLines[0].split(" ")[1]); a++) {
		recipe_name_and_base = tagLines[tag_lines_count].split(" ");
		//console.log(recipe_name_and_base);
		recipe_base = recipe_name_and_base[0];
		tag_lines_count++;
		recipes[recipe_base] = {};
		recipes[recipe_base][tags] = [];
		recipes[recipe_base].string_name = tagLines[tag_lines_count];
		tag_lines_count++;
		for(var b = 0; b<parseInt(recipe_name_and_base[1]); b++) {
			tag_name = tagLines[tag_lines_count];
			//console.log(tag_name);
			recipes[recipe_base][tags].push(tag_name);
			if(!(tag_name in tags)) {
				tags[tag_name] = [];
			}
			tags[tag_name].push(recipe_base);
			tag_lines_count++;
		}
		//console.log(a);
	}
	console.log(recipes);

	return recipes;
}

//--------------------------------------------------------------------------------------------------------|