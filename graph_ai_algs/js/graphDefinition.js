var Graph = function(){
	this.node_list = {};
	return this;
};

var Node = function(name) {
	this.edge_list = [];
	this.name = name;
	return this;
}

var Edge = function(from, to, weight) {
	this.from_node= from;
	this.to_node= to;
	this.weight= weight;
}



/*

Graph: {
	a: Node(a, [(a,b,2), (a,c,1)] )
	b: Node(b, [(b,a,2)] )	
	c: Node(c, [(c,a,1)] )
}

Node: {
	(name, edge_List)
}

Edge: {
	(from, to, weight)
}

*/


