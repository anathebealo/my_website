var queens = []; 
var sol = [];

function startGame(){
	n = document.getElementById('get_n').value; 
	queens = [];
	sol = [];
	if(is_proper_n(n)) {
		make_svg_holder(n);  
		sol = nQueens(n);
		makeD3Table(n); 
	} else {
		document.getElementById('board').innerHTML = "<p> It is not possible to solve n-queens with an n value of <span id='n_value'>" + n + "</span></p>";
	}
};

function queens_final_spots(n) {
	queens[0][0]
		.transition()
		.attr("y", sol[0]*50 + 40);
}

function is_proper_n(n) {
	if( n <= 0 ) {
		return false;
	} else if( n == 2 || n == 3 ) {
		return false; 
	} else if( isNaN(n) ) {
		return false; 
	} else {
		return true; 
	}
}

function make_svg_holder(n) {
	width = (parseInt(n)+2)*50; 
	d3.select("svg").remove();
	document.getElementById('board').innerHTML = "<p> </p>";
	var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", n*50)
        .attr("align", "center") 
  		.attr("text-align", "center");
}

function makeD3Table(n) {
	var squares = [];
	x_init = (parseInt(n)+1)*50;
	for(i = 0; i<n; i++) {
		for(j = 0; j<n; j++) {
			if( j%2 == 0 ) {
				if( i%2 == 0 ) {
					squares.push([d3.select("svg")
						.append("rect")
						.attr("x", x_init)
						.attr("y",50)
						.attr("width",50)
						.attr("height",50)
						.attr("fill", "gray"),
						50*i,
						50*j]);
				} else {
					squares.push([d3.select("svg")
						.append("rect")
						.attr("x",x_init)
						.attr("y",150)
						.attr("width",50)
						.attr("height",50)
					  	.attr("fill", "white"),
						50*i,
						50*j]);
				}
			} else {
				if( i%2 == 1 ) {
					squares.push([d3.select("svg")
						.append("rect")
						.attr("x",x_init)
						.attr("y",50)
						.attr("width",50)
						.attr("height",50)
						.attr("fill", "gray"),
						50*i,
						50*j]);
				} else {
					squares.push([d3.select("svg")
						.append("rect")
						.attr("x", x_init)
						.attr("y",150)
						.attr("width",50)
						.attr("height",50)
					  	.attr("fill", "white"),
						50*i,
						50*j]);
				}
			}
		}
	}

	squares[0][0]
	    .transition()
	    .attr("x", squares[0][1])
	    .attr("y", squares[0][2])
	    .duration(100)
	    .each("end", function() {
	    	var x = square_transitions(squares, 1, n, sol);
	    });		    
}

function make_queens(initial, n) {
	for(i = 0; i<initial.length; i++) {
		queens.push([d3.select("svg")
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.html('&#9813;')
			.attr("font-family", "sans-serif")
			.attr("font-size", 45)
			.attr("fill", "black")
			, i*50 + 4
			, initial[i]*50 + 40]);
	} 

	queens[0][0]
		.transition()
		.attr("x", queens[0][1])
		.attr("y", queens[0][2])
		.each("end", function() {
			queen_transitions(1, n);
		});
}

function queen_transitions(counter, n) {
	queens[counter][0]
	    .transition()
	    .attr("x", queens[counter][1])
	    .attr("y", queens[counter][2])
	    .duration(100)
	    .each("end", function() {
	    	if(counter < n - 1) {
	    		queen_transitions(++counter, n);
	    	} else {
	    		queens_final_spots(n);
	    	}
	    });		
}

function square_transitions(squares, counter, n, initial) {
	squares[counter][0]
	    .transition()
	    .attr("x", squares[counter][1])
	    .attr("y", squares[counter][2])
	    .duration(100)
	    .each("end", function() {
	    	if(counter < n*n - 1) {
	    		square_transitions(squares, ++counter, n, initial);
	    	} else {
	    		make_queens(initial, n);
	    	}
	    });		
}

function colorTable(n) {
	var rowCount = 0;
	var colCount = 0; 
	var table = document.getElementById("gameBoard");

	for (var i = 0, row; row = table.rows[i]; i++) {
	    for (var j = 0, col; col = row.cells[j]; j++) {
	    	if( (rowCount%n)%2 == 0 && (colCount%n)%2 == 0) { 
				col.setAttribute("bgcolor", "#aaaaaa"); 
			} else if( (rowCount%n)%2 == 1 && (colCount%n)%2 == 1) { 
				col.setAttribute("bgcolor", "#aaaaaa"); 
			} else {
				col.setAttribute("bgcolor", "#ffffff");
			}
			colCount++; 
		}
		rowCount++;
	}
}

function nQueens(n) {
	var b = new Array(n); 
	var solution = false; 
	var new_spot; 
	for(var i = 0; i<n; i++)
		b[i] = i; 
	shuffle(b);
	search = 0; 

	while (!solution) {
		if (is_solution(b)) {
			solution = true; 
			return b;
		} else {
			search ++; 
			new_spot = find_new_queen_spot(b); 
			b[new_spot[0]] = new_spot[1]; 
		}
	}
}

function find_new_queen_spot(board) {
	var min = find_collisions(board); 
	var min_index = board.length + 1;
	var new_index_value = 0; 

	var old_index_value = board[0];
	var old_collisions = 0; 
	var collisions = 0; 

	old_collisions = find_collisions(board); 

	for(var i = 0; i<board.length; i++){
		old_index_value = board[i];
	
		for(var j = 0; j<board.length; j++){
			board[i] = j; 
			collisions = find_collisions(board);
			
			if(min > collisions) {
				min = collisions; 
				min_index = i; 
				new_index_value = j; 
			}
		}
	
		board[i] = old_index_value; 
	}	
	
	if( min == old_collisions ){
		shuffle(board); 
		return find_new_queen_spot(board); 
	}
	return [min_index, new_index_value]; 
}

//finds all collisions that stem from queen being moved around one column
function find_collisions(board) {
	num_collisions = 0; 
	for(var k = 0; k<board.length; k++) {
		for(var l = k; l<board.length; l++) {
			if(k != l) {
				if(exists_collision(k, board[k], l, board[l])) {
					num_collisions+=1; 
				}
			}
		}
	}

	return num_collisions; 
}

//checks for collision between two coordinates in gameboard
function exists_collision(i, j, k, l) {
	if( i == k ) {
		return true; 
	} else if( j == l) {
		return true; 
	} else if( Math.abs(i - k) == Math.abs(j - l)) {
		return true; 
	} else {
		return false; 
	}
}

//Fisher-Yates shuffle algorithm
function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a; 
}

function is_solution(board) {
	for(var i = 0; i < board.length - 1; i++){
		for(var j = i + 1; j < board.length; j++) {
			if(i != j) {
				if( exists_collision(i, board[i], j, board[j]) ){
					return false; 
				} 
			}
		}
	}
	return true; 
}
