//initiate game

/*
 * figure out how many queens to place
 * make sure it is a solvable number of them
 * call create objects method
 * solve for queens
 * call for animations
 */
function start_game(){
	n = document.getElementById('get_n').value; 
	if(is_proper_n(n)) {
		a_queen_solutions = solve_n_queens(n);
	} else {
		document.getElementById('board').innerHTML = "<p> It is not possible to solve n-queens with an n value of <span id='n_value'>" + n + "</span></p>";
	}

};
//create objects for board and queens

//solve for queen spots
function solve_n_queens(n) {
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

/*
 * Finds the total number of collisions that can happen when a queen is moved to a new spot on the board
 */
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

/*
 * checks for collision between two coordinates in gameboard
 */
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

/* 
 * Fisher-Yates shuffle algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a; 
}

/*
 * checks to see if the current board formation is a solution by looking for collisions 
 */
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


//do animations