function draw() {
    var tableString = "<table>";
    
    for(var i = 0; i<game.boardWidth; i++) {
        tableString += "<tr>";
        for(var j = 0; j<game.boardHeight; j++) {
            if( (i != game.cursorX) || (j != game.cursorY) ) {
	    	if( game.board[i][j] == -1) {
			tableString += "<td class=empty><div> </div></td>";
		} else {
                	tableString += "<td class=" + game.squareColors[game.board[i][j]] + ">" + game.board[i][j] + "</td>";
            	}
	    } else {
                tableString += "<td id=cursor> <div> </div> </td>";
            }
        }
        tableString += "</tr>";
    }
    tableString += "</table> <br>"
    
    document.getElementById("board").innerHTML = tableString;
}
	
function drawEmpty() {
    document.getElementById("board").innerHTML = "";
}