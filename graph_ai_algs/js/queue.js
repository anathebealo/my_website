var Queue = function() {
	var queue = [];
	this.push = function(node_to_add) {
		queue.push(node_to_add);
	}

	this.pop = function() {
		if(queue.length > 0) {
			var popped_node = queue[0];
			queue.shift();
			return popped_node;
		}
	}

	this.peek = function() {
		if(queue.length > 0) {
			return queue[0];
		}
	}

	this.is_empty = function() {
		if( queue.length == 0 ) { 
			return true;
		} else {
			return false;
		}
	}
}