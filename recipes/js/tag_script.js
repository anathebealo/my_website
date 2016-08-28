$(document).ready(function(){
    $('#search').keypress(function(e){
      if(e.keyCode==13) {
      	$('#searchSubmit').click();
  	  }
    });
});

$(window).scroll(function(e){ 
  var $el = $('.searchGroup'); 
  var isPositionFixed = ($el.css('position') == 'fixed');
  if ($(this).scrollTop() > 400 && !isPositionFixed){ 
    $('.searchGroup').css({'position': 'fixed', 'top': '0px', 'box-shadow': '0px 12px 12px -12px rgba(0,0,0,0.5)'});
    $('#buffer').css({'visibility': 'visible', 'height': '100px'});
  }
  if ($(this).scrollTop() < 400 && isPositionFixed)
  {
    $('.searchGroup').css({'position': 'static', 'top': '0px', 'box-shadow': '0px 0px 0px 0px rgba(0,0,0,0.0)'}); 
    $('#buffer').css({'visibility': 'hidden', 'height': '0px'}); 
  }
});

// getting information from txt files ------------------------------------------------------------------------------------------|
function get_setup() {
	jQuery.get("txtRecipes/setup.txt", function(data) {
		make_master_list(data);
	});
}

var recipes = {};
var tags = {};

// parsing text file data ------------------------------------------------------------------------------------------------------|
// parsing setup file data -------------------------------------------------------------------------------------|
function make_master_list(data) {
	var tagLines = data.split("\n").map(function(line){ return line.replace('\r', '')});
	var recipe_base = "";
	var recipe_name_and_base = "";
	var tag_name = "";
	var tag_lines_count = 1;
	//grab all info and put it into recipes array -- each recipe is an index
	for(var a = 0; a<parseInt(tagLines[0].split(" ")[1]); a++) {
		recipe_name_and_base = tagLines[tag_lines_count].split(" ");
		recipe_base = recipe_name_and_base[0];
		tag_lines_count++;
		recipes[recipe_base] = {};
		recipes[recipe_base][tags] = [];
		recipes[recipe_base].string_name = tagLines[tag_lines_count];
		tag_lines_count++;
		for(var b = 0; b<parseInt(recipe_name_and_base[1]); b++) {
			tag_name = tagLines[tag_lines_count];
			recipes[recipe_base][tags].push(tag_name);
			if(!(tag_name in tags)) {
				tags[tag_name] = [];
			}
			tags[tag_name].push(recipe_base);
			tag_lines_count++;
		}
	}

	draw_all_tag_thumbnails(recipes, tags);

	var availableTags = [];
	for (var tag_name in tags) {
    	availableTags.push(tag_name);
	}    
    
    $( "#search" ).autocomplete({
    	source: availableTags
    });
}

//drawing thumbnails -------------------------------------------------------------------------------------|

function draw_all_tag_thumbnails() {
	$('.searchGroup').css({'box-shadow': '0px 0px 0px 0px rgba(0,0,0,0.0)'}); 
	var tag_list = "";
	var onclick = "";
	var recipe_base = "";
	
	var color_counter = 0;

	tag_list += "<div id='tag_thumbnail_container'>";
	for( var recipe in recipes){
		tag_list += "<div class='tag_thumbnail' onclick='location.href=\"http://www.anabealo.com/recipes/recipes.html?" + recipe + "\"'>";
		tag_list += "<p>" + recipes[recipe].string_name + "</p> <img src=\"images/" + recipe + ".jpg\"></div>"; 
	}
	tag_list += "</div>"

	document.getElementById("master_tag_thumbnail_container").innerHTML = tag_list;
}

function draw_tag_thumbnails() {
	$('.searchGroup').css({'box-shadow': '0px 0px 0px 0px rgba(0,0,0,0.0)'}); 
	var tag_list = "";
	var onclick = "";
	var recipe_base = "";
	
	var color_counter = 0;
	for (var tag_name in tags) {
	  	if (tags.hasOwnProperty(tag_name)) {
	  		if( color_counter%2 === 0) {
	  			tag_list += "<div class='white'><div id='tag_thumbnail_container'><h3>" + tag_name + "</h3>"
	  		} else {
	  			tag_list += "<div class='gray'><div id='tag_thumbnail_container'><h3>" + tag_name + "</h3>"
	  		}
	  		color_counter++;
		  	for(var c = 0; c<tags[tag_name].length; c++) {
				recipe_base = tags[tag_name][c];
				tag_list += "<div class='tag_thumbnail' onclick='location.href=\"http://www.anabealo.com/recipes/recipes.html?" + recipe_base + "\"'>";
				tag_list += "<p>" + recipes[recipe_base].string_name + "</p> <img src=\"images/" + recipe_base + ".jpg\">"; 
				tag_list+="</div>";
			}
			tag_list += "</div></div>";
	  	}
	}
	document.getElementById("master_tag_thumbnail_container").innerHTML = tag_list;
}

function show_tag() {
    $('.searchGroup').css({'box-shadow': '0px 0px 0px 0px rgba(0,0,0,0.0)'}); 
	var tag_to_show = $("#search").val().charAt(0).toUpperCase() + $("#search").val().slice(1);
	var tag_list = "";
	if(tag_to_show === "") {
		return;
	}

	if(tags.hasOwnProperty(tag_to_show)) {
  		tag_list += "<div id='tag_thumbnail_container'><h3>" + tag_to_show + "</h3>"

	  	for(var c = 0; c<tags[tag_to_show].length; c++) {
			recipe_base = tags[tag_to_show][c];
			tag_list += "<div class='tag_thumbnail' onclick='location.href=\"http://www.anabealo.com/recipes/recipes.html?" + recipe_base + "\"'>";
			tag_list += "<p>" + recipes[recipe_base].string_name + "</p> <img src=\"images/" + recipe_base + ".jpg\">"; 
			tag_list+="</div>";
		}
		tag_list += "</div>";
		document.getElementById("master_tag_thumbnail_container").innerHTML = tag_list;
		return;
	} else {
		document.getElementById("master_tag_thumbnail_container").innerHTML = "<h1 class='error'> Sorry, '" + tag_to_show + "' isn't a category.</h1><h2 class='error'>Please select from the dropdown under the search bar. If it isn't there, it doesn't exist (yet).</h2>";
		return;	
	}

}