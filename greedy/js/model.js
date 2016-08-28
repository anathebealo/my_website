function isMoveValid(x, y) {
    var x1 = game.cursorX;
    var x2 = x1 + x*(game.board[game.cursorX + x][game.cursorY + y]);
    var y1 = game.cursorY;
    var y2 = y1 + y*(game.board[game.cursorX + x][game.cursorY + y]);
    console.log(x1, x2, y1, y2);
    if( game.board[game.cursorX + x][game.cursorY + y] != -1) {
        if( game.cursorX + x*(game.board[game.cursorX + x][game.cursorY + y]) >=0 && game.cursorX + x*(game.board[game.cursorX + x][game.cursorY + y]) < game.boardWidth &&
            game.cursorY + y*(game.board[game.cursorX + x][game.cursorY + y]) >= 0 &&  game.cursorY + y*(game.board[game.cursorX + x][game.cursorY + y]) < game.boardHeight ) { 
        	if( x1 != x2 ) {
            	if( x1 < x2 ) {
                		for(var i = x1; i<=x2; i++) {
                   			if(game.board[i][y1] == -1) {
                                console.log("-1!");
            					return false;
            				}
                		}
            	} else {
                		for(var i = x1; i>=x2; i--) {
                	    	if(game.board[i][y1] == -1) {
                                console.log("-1!");
            					return false;
            				}
                		}
            	}
            } else if(y1 != y2) {
            	if( y1 < y2 ) {
                		for(var i = y1; i<=y2; i++) {
                    		if(game.board[x1][i] == -1) {
                                console.log("-1!");
            					return false;
            				}
                		}
            	} else {
                		for(var i = y1; i>=y2; i--) {
                    		if(game.board[x1][i] == -1) {
                                console.log("-1!");
            					return false;
            				}
                		}
            	}
        	}
    	    return true;
        } 
        return false;
    }
    return true;
}
function makeNewBoard() {
    var row = [];
    for(var i = 0; i<game.boardWidth; i++) {
        for(var j = 0; j<game.boardHeight; j++) {
            row.push( Math.floor(Math.random() * (game.maxNum - game.minNum + 1) + game.minNum) );
        }
        game.board.push(row.slice());
        row = [];
    }
    game.cursorX = Math.floor( Math.random() * game.boardWidth );
    game.cursorY = Math.floor( Math.random() * game.boardHeight );
    game.board[game.cursorX][game.cursorY] = '*';
}

function makeMove(x, y) {
    var x1 = game.cursorX;
    var x2 = x1 + x*(game.board[game.cursorX + x][game.cursorY + y]);
    var y1 = game.cursorY;
    var y2 = y1 + y*(game.board[game.cursorX + x][game.cursorY + y]);
    if( game.board[game.cursorX + x][game.cursorY + y] != -1) {
        game.score += game.board[game.cursorX + x][game.cursorY + y];
        if( x1 != x2 ) {
            if( x1 < x2 ) {
                for(var i = x1; i<x2; i++) {
                    game.board[i][y1] = -1;
                }
                game.cursorX = i; 
                game.cursorY = y1;
            } else {
                for(var i = x1; i>x2; i--) {
                    game.board[i][y1] = -1;
                }
                game.cursorX = x2; 
                game.cursorY = y1;
            }
        } else if(y1 != y2) {
            if( y1 < y2 ) {
                for(var i = y1; i<y2; i++) {
                    game.board[x1][i] = -1;
                }
                game.cursorX = x1; 
                game.cursorY = i;
            } else {
                for(var i = y1; i>y2; i--) {
                    game.board[x1][i] = -1;
                }
                game.cursorX = x1; 
                game.cursorY = y2;
            }
        }
    }
    document.getElementById("loser").innerHTML = "<p id=score> Score: <strong>" + Math.round(game.score/(game.boardWidth*game.boardHeight)*1000)/10 + "%</strong></p>";
}


