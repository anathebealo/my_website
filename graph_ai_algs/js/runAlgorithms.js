function dfs(graph, from_node) {
 	var output = "";
 	var V = {}; 								//visited list
 	for( key in graph.node_list ) {
 		V[key] = false;
 	}

 	var S = new Stack();
 	S.push(graph.node_list[from_node]);
 	while( !S.is_empty() ) {
 		v = S.pop();
 		if( !V[v.name] ) {
 			output += v.name + ", ";
 			V[v.name] = true;
 			for( var i = 0; i < v.edge_list.length; i++ ) {
 				var edge = v.edge_list[i];
 				S.push(graph.node_list[edge.to_node]);

 			}
 		}
 	}
 	return output;
}

function bfs(graph, from_node) {
 	console.log("bfs");
 	var output = "";
 	var V = {}; 								//visited list
 	for( key in graph.node_list ) { 
 		V[key] = false;
 	}

 	var Q = new Queue();
 	Q.push(graph.node_list[from_node]);
 	while( !Q.is_empty() ) {
 		v = Q.pop();
 		if( !V[v.name] ) {
 			output += v.name + ", ";
 			V[v.name] = true;
 			for( var i = 0; i < v.edge_list.length; i++ ) {
 				var edge = v.edge_list[i];
 				Q.push(graph.node_list[edge.to_node]);
 			}
 		}
 	}
 	return output;
}

 // ReachSet = {0};                    // You can use any node...
 //   UnReachSet = {1, 2, ..., N-1};
 //   SpanningTree = {};

 //   while ( UnReachSet ≠ empty )
 //   {
 //      Find edge e = (x, y) such that:
 //         1. x ∈ ReachSet
	//  2. y ∈ UnReachSet
	//  3. e has smallest cost

 //      SpanningTree = SpanningTree ∪ {e};

 //      ReachSet   = ReachSet ∪ {y};
 //      UnReachSet = UnReachSet - {y};
 //   }

function prim(graph, from_node) {
 	var reachSet = [];
 	var unReachSet = [];

 	reachSet.push(graph.node_list[from_node]);
 	for(var key in graph.node_list) {
 		if(key != from_node) {
 			unReachSet.push(graph.node_list[key]);
 		}
 	}

 	var spanningTree = [];
 	var smallestEdge = reachSet[0].edge_list[0];
 	while( unReachSet.length != 0) {

 		//find smallest edge
 		for(var i = 0; i<reachSet.length; i++ ) {
 			for(var j = 0; j<reachSet[i].edge_list.length; j++) {
 				//console.log(graph.node_list[reachSet[i].edge_list[j].to_node]);
 				if( unReachSet.indexOf(graph.node_list[reachSet[i].edge_list[j].to_node]) != -1 ) {  	//if from reach set to unreach set
 					if( reachSet[i].edge_list[j].weight < smallestEdge.weight ) {
 						smallestEdge = reachSet[i].edge_list[j];
 					}
 				}
 			}
 		} 

 		spanningTree.push(smallestEdge);
 		reachSet.push(graph.node_list[smallestEdge.from_node]);
 		unReachSet.splice( unReachSet.indexOf(graph.node_list[smallestEdge.from_node]), 1);
 		//console.log("reachset: " + reachSet);
 		console.log("unreach: " + unReachSet);
 	}

 	var e_string = "";
 	for(var e = 0; e<spanningTree.length; e++ ) {
 		e_string += "(" + spanningTree[e].from_node + ", " + spanningTree[e].to_node + ", " + spanningTree[e].weight + ")  ";
 	}
 	return e_string;
}

function kruskal(graph) {
 	console.log("kruskal");

}

function dijkstra(graph) {
 	console.log("dijkstra");
}