function WhichAlgorithm() {
	var index = document.getElementById("select").selectedIndex;
	var options = document.getElementById("select").options;

	var graph = document.getElementById("graph").value;
	var graphInType = document.querySelector('input[name = "graphType"]:checked').value;
	var graph;

	if( graphInType == 'matrix' ) {
		graph = parseMatrixGraph(graph);
	} else if( graphInType == 'coordinates' ) {
		graph = parseCoordinateGraph(graph);
	}

	switch(options[index].value) {
	    case "dfs":
	    	path = dfs(graph, "a");
	        break;
	    case "prim":
			path = prim(graph, "a");
	        break;
	    case "bfs":
			path = bfs(graph, "a");
	        break;
	    case "kruskal":
			kruskal(graph);
	        break;
	    case "dijkstra":
			dijkstra(graph);
	        break;
	    default:
	        break;
	}

	document.getElementById("output").innerHTML = "<p> " + path + " </p>";
	document.getElementById("error").innerHTML = "<p></p>";
}

// graph with c being isolated and directed a and b: 
// 3 [a,b,c] {4,0,0} {5,5,0} {0,0,0} =
//	  |  a   b   c 
//  --|-------------
//  a |  4   0   0
//  b |  3   3   0
//  c |  0   0   0

function parseMatrixGraph(text) {
	var graph = new Graph();

	text = text.replace(" ", "");
	var name_start = text.indexOf("[", 0);
	var name_end = text.indexOf("]", 0);

	var names = text.substring(name_start+1, name_end).split(",");
	var num_of_nodes = Number(text.substring(0, name_start));
	var counter = 0;

	while(counter < names.length) {
		graph.node_list[names[counter]] =  new Node(names[counter]);
		counter++;
	}

	var row_start = 0;
	var row_end = 0;
	var begin = 0;

	var from, to; 
	var weight = 0;
	for( var i = 0; i<names.length; i++ ) {
		row_start = text.indexOf("{", begin);
		row_end = text.indexOf("}", begin);
		var cur_row_ar = text.substring(row_start+1, row_end).split(",");
		
		from = names[i];

		for(var j = 0; j<cur_row_ar.length; j++) {
			to = names[j];
			weight = Number(cur_row_ar[j]);
			if(weight != 0) {
				graph.node_list[names[i]].edge_list.push(new Edge(from, to, weight));
				weight = 0;
			}
		}
		begin = row_end+1;
	}
	return graph;
}

// graph represented above is: 
// 4 [a,b,c,d] (a,a,4) (b,a,3) (b,b,3) 
// and without edge weights
// 4 [a,b,c,d] (a,a) (b,a) (b,b)
function parseCoordinateGraph(text) {
	try {
		var graph = new Graph();
		text = text.replace(" ", "");
		var name_start = text.indexOf("[", 0);
		var name_end = text.indexOf("]", 0);

		if( name_start == -1 ) {
			throw "Missing: '['"
		} else if(name_end == -1 ) {
			throw "Missing: ']'";
		}
		
		var names = text.substring(name_start+1, name_end).split(",");
		var num_of_nodes = Number(text.substring(0, name_start));
		var counter = 0;

		if( names.length != num_of_nodes ) {
			throw "Mis matched number of nodes and names entered.";
		}

		while(counter < names.length) {
			graph.node_list[names[counter]] =  new Node(names[counter]);
			counter++;
		}

		var begin = 0;
		var from, to; 
		var weight = 0;

		var edge_start = text.indexOf("(", begin);
		var edge_end = text.indexOf(")", begin);

		if( edge_start == -1 ) {
			throw "Missing: '('"
		} else if(edge_end == -1 ) {
			throw "Missing: '])'";
		}

		while(edge_start != -1) {
			var cur_edge_ar = text.substring(edge_start+1, edge_end).split(",");

			from = cur_edge_ar[0];
			to = cur_edge_ar[1];
			if( cur_edge_ar.length == 3 ) {
				weight = Number(cur_edge_ar[2]);
			} else {
				weight = 1;
			}

			if( ! (from in graph.node_list) ) {
				throw "From node " + from + " does not exist";
			}

			if( ! (to in graph.node_list) ) {
				throw "From node '" + to + "' does not exist";
			}

			graph.node_list[from].edge_list.push(new Edge(from, to, weight));
			begin = edge_end+1;
			edge_start = text.indexOf("(", begin);
			edge_end = text.indexOf(")", begin);

			if( edge_start == -1 && begin < text.length - 3) {
				throw "Missing: '(' in an edge definition"
			} else if(edge_end == -1 && begin < text.length - 3) {
				throw "Missing: ')' in an edge definition";
			}
		}

		return graph;
	}
	catch(err) {
		document.getElementById("error").innerHTML = err;
		document.getElementById("output").innerHTML = "<p></p>";
	}
}














