var Stack = function() {
	var stack = [];
	this.push = function(node_to_add) {
		stack.push(node_to_add);
	}

	this.pop = function() {
		if( stack.length > 0){
			var popped_node = stack[stack.length - 1];
			stack.pop();
			return popped_node;
		}
	}

	this.peek = function() {
		if( stack.length > 0 ) {
			return stack[stack.length - 1];
		}
	}

	this.is_empty = function() {
		if( stack.length == 0 ) { 
			return true;
		} else {
			return false;
		}
	}
}