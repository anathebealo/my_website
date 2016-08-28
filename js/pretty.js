make_svg();

function make_svg() {
	var svg = d3.select("body")
		.select("#fuck")
        .append("svg")
        .attr("width", 36*5)
        .attr("height", 36)
        .attr("align", "center") 
  		.attr("text-align", "center");
  	console.log(svg);
  	d3.select("svg")
  		.append("a")
	    .attr("xlink:href", "abealo_resume.pdf")
	    .append("object") 
	    .attr("type", "image/svg+xml")
	    .attr("data", "document-fill.svg") 
	    .attr("x", 100)
	    .attr("y", 50)
	    .attr("height", 100)
	    .attr("width", 200);

	d3.select("svg")
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.html('&#9813;')
			.attr("font-family", "sans-serif")
			.attr("font-size", 45)
			.attr("fill", "black");
  }

