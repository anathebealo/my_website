var game = undefined;
var f = undefined;
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

function initializeGame() {
    game = {
        board: [],
        boardWidth: 25,
        boardHeight: 45,
        minNum: 1,
        maxNum: 9,
        squareColors: ['cursor','red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'pink', 'gray'],
        spacesCleared: 0,
        score: 0,
        cursorX: 0,
        cursorY: 0
    };
    document.getElementById("loser").style.visibility = "visible";
    document.getElementById("loser").innerHTML = "<p id=score> Score: <strong>" + game.score + "</strong></p>";
    document.getElementById("loser").style.backgroundColor = "#66ffb3";
    document.getElementById("startGame").disabled = true;
    document.getElementById("restartGame").disabled = false;
    makeNewBoard();
    draw();
    mainGamePlay();
}

function restartGame() {
    window.removeEventListener('keydown', f, false);
    document.getElementById("loser").innerHTML = "<p></p><p id=score> </p>";
    document.getElementById("loser").style.visibility = "hidden";
    document.getElementById("loser").style.backgroundColor = "#66ffb3";
    document.getElementById("startGame").disabled = false;
    document.getElementById("restartGame").disabled = true;
    game = undefined;
    drawEmpty();
}

function mainGamePlay() {
    f = function(event) {
        switch(event.keyCode) {
            case UP:
                if(isMoveValid(-1, 0)) {
                    makeMove(-1, 0);
                    draw();
                } else {
                    youLose();
                }
                break;
            case DOWN:
                if(isMoveValid(1, 0)) {
                    makeMove(1, 0);
                    draw();
                } else {
                    youLose();
                }
                break;
            case LEFT:
                if(isMoveValid(0, -1)) {
                    makeMove(0, -1);
                    draw();
                } else {
                    youLose();
                }
                break;
            case RIGHT:
                if(isMoveValid(0, 1)) {
                    makeMove(0, 1);
                    draw();
                } else {
                    youLose();
                }
                break; 
            default: 
                break; 
        }
        dir = 0;
    };

    window.addEventListener('keydown', f, false);
}

function youLose(func) {
    console.log("you lose!");
    window.removeEventListener('keydown', f, false);
    document.getElementById("loser").style.backgroundColor = "#ff8080";
    document.getElementById("loser").innerHTML = "<p id=loserText> You Lost! Click restart to try again! Score:" + Math.round(game.score/(game.boardWidth*game.boardHeight)*1000)/10 + "%</p>";
}

function intervalManager(flag, time) {

}