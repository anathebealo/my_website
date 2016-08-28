var SNAKE = 1;
var SNAKEHEAD = 2;
var FOOD = 3;
var EMPTY = 0;
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

var game = {
    board: [],
    score: 0,
    won: false,
    lost: false
}

function Pair(x, y) {
    return {i: x, j: y};
}

var snakeQueue = {
    list: [],
    push: function(x) {this.list.push(Pair(x.i, x.j));}, 
    pop: function() {this.list.shift();},
    peekHead: function() {
            return this.list[this.list.length - 1];
        },
    peekEnd: function() {return this.list[0];},
    inQueue: function(x) {
            for(var i = 0; i<this.list.length; i++) { 
                if(this.list[i].i == x.i && this.list[i].j == x.j) {
                    return true;
                }
            } 
            return false;
        },
    queueSize: function() {return this.list.length}
}

function initializeGame() {
    var row = [];
    for(var i = 0; i<50; i++) {
       row.push(EMPTY);
    }
    
    for(var j = 0; j<20; j++) {
        game.board.push(row.slice());
    }
     
     document.getElementById("board").innerHTML = getBoardStr();
     document.getElementById("board").style.visibility = "visible";
     document.getElementById("startGame").disabled = true;
     document.getElementById("restartGame").disabled = false;
     waitForPlayGame();
}

function waitForPlayGame() {
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if(evt.keyCode == 32) {
            var food = newFoodLocation();
            game.board[food.i][food.j] = FOOD;
            game.board[0][0] = SNAKE;
            snakeQueue.push(Pair(0,0));
            draw(getBoardStr());
            playGame();
        }
    };
}

function playGame() {
    var curDir = RIGHT;
    
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        curDir = evt.keyCode;
    };
    
    setInterval( function() {
        updateSnakeBoard(curDir);
       // console.log("direction: ", curDir);
        if( !game.won && !game.lost ) {
            draw(getBoardStr());
        }
        
    }, 200);
       
}

var toAdd = 0;
function updateSnakeBoard(direction) {
    var oldNode = Pair(snakeQueue.peekHead().i, snakeQueue.peekHead().j);
    var newNode = undefined;
    switch(direction) {
        case UP:
            newNode = Pair(oldNode.i - 1, oldNode.j);
            break;
        case DOWN:
            newNode = Pair(oldNode.i + 1, oldNode.j);
            break;
        case LEFT:
            newNode = Pair(oldNode.i, oldNode.j - 1);
            break;
        case RIGHT:
            newNode = Pair(oldNode.i, oldNode.j + 1);
            break; 
        default: 
            return; 
    }
    
    if( newNode.i < 0 || newNode.i > game.board.length - 1 ||
        newNode.j < 0 || newNode.j > game.board[newNode.i].length - 1 ) {
            game.lost = true;
            console.log("game lost");
    } else if( snakeQueue.inQueue(newNode) ) {
        game.lost = true;
        console.log("game lost");
    } else if( snakeQueue.queueSize() == game.board.length*game.board[0].length ) {
        game.won = true;
        console.log("game won");
    } else {
        if( game.board[newNode.i][newNode.j] == FOOD ) {
            console.log("ate food");
            toAdd += 3;
            var foodLocation = newFoodLocation();
            game.board[foodLocation.i][foodLocation.j] = FOOD;
        }
        
        game.board[snakeQueue.peekHead().i][snakeQueue.peekHead().j] = SNAKE;
        snakeQueue.push(Pair(newNode.i, newNode.j));
        console.log("newnode i: ", newNode.i, " newnode j: ", newNode.j);
        if(toAdd == 0) {
            game.board[snakeQueue.peekEnd().i][snakeQueue.peekEnd().j] = EMPTY;
            game.board[snakeQueue.peekHead().i][snakeQueue.peekHead().j] = SNAKEHEAD;
            snakeQueue.pop();
        } else {
            toAdd--;
        }
    }
}

function newFoodLocation() {
    var iVal = Math.floor(Math.random() * game.board.length - 1);
    var jVal = Math.floor(Math.random() * game.board[iVal].length - 1);
    
    while(game.board[iVal][jVal] == SNAKE) {
        iVal = Math.floor(Math.random() * game.board.length - 1);
        jVal = Math.floor(Math.random() * game.board[iVal].length - 1);
    }
    
    return Pair(iVal,jVal);
}

function getBoardStr() {
    var strBoard = "";
    for(i = 0; i<game.board.length; i++) {
         for(j = 0; j<game.board[i].length; j++) {
            if(game.board[i][j] == 0) {
                strBoard += " ";
            } else if(game.board[i][j] == SNAKEHEAD) {
                strBoard += "X";
            } else if(game.board[i][j] == SNAKE) {
                strBoard += "x";
            } else if(game.board[i][j] == FOOD) {
                strBoard += "0";
            }
         }
         strBoard += "\n";
     }
     return strBoard;
}

function draw(boardStr) {
    document.getElementById("board").innerHTML = getBoardStr();
}

function restartGame() {
    game.board = [];
    game.score = 0; 
    document.getElementById("board").innerHTML = ""; 
    document.getElementById("board").style.visibility = "hidden";
    document.getElementById("startGame").disabled = false;
    document.getElementById("restartGame").disabled = true;
}
