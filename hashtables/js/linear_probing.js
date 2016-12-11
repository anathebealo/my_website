function Linear_probing_hash_table(size, probe) {
    Hash_table.call(this, size);
    this.probe = probe;
    
    this.check_insert = function(x, index, game_hash_table) {
        if(game_hash_table.table[index].length !== 0) {
            if(game_hash_table.table[index][0] === x) {
                return true;
            }
        }
        return false;
    }

    this.insert_please = function(x) {
        var ourIndex = this.hashFunc(x);
        if(this.table[ourIndex].length === 0) {
            this.insert(x, ourIndex);
            return true;
        } else {
            var count = 1;
            while(this.table[ourIndex].length !== 0) {
                if(count < this.size) {
                    ourIndex = (ourIndex + this.probe)%this.size;
                } else {
                    return false;
                }
            }
            this.insert(x, ourIndex);
            return true;
        }
    }
}

function Hash_table(size) {
    this.size = size;
    this.table = Array(this.size);
    for(var i = 0; i<size; i++) {
        this.table[i] = [];
    }

    this.hashFunc = function(x) {
        return x%this.size;
    }

    this.insert = function(x, index) {
        this.table[index].push(x);
    }
}

/*****************************************************
need flow: 
    1. user selects linear probing hash table
    2. user is given number to insert
    3. user selects box that she thinks it should be put into
    4. we check whether the box selected is correct
    5. if correct, we insert that number and repeat step 2-5
    6. if incorrect, we give a nice "wrong" message and repeat steps 3-5
    7. when all boxes are filled, say "good job! do you want another?"
*****************************************************/

function Game_object(sizes, probes) {
    this.random_inserts = undefined;
    this.remaining_inserts = undefined;
    this.user_hash_table = undefined;
    this.game_hash_table = undefined;
    this.current_random = undefined;
    this.html_hash_table = undefined;

    this.start_game = function() {
        document.getElementById("message").innerHTML = "";

        var random_index = Math.floor(Math.random()*6);
        this.game_hash_table = new Linear_probing_hash_table(sizes[random_index], probes[random_index]);

        this.random_inserts = [];
        for(var i = 0; i<sizes[random_index]; i++) {
            var random = Math.floor(Math.random()*70);
            this.random_inserts.push(random);
        }

        console.log("size: " + sizes[random_index]);
        console.log("probe: " + probes[random_index]);
        console.log("randomInserts: [" + this.random_inserts + "]");
        console.log("random inserts length: " + this.random_inserts.length);

        for(i = 0; i<this.random_inserts.length; i++) {
            this.game_hash_table.insert_please(this.random_inserts[i]);
        }

        this.remaining_inserts = this.random_inserts.length;
        this.user_hash_table = new Linear_probing_hash_table(sizes[random_index], probes[random_index]);
        this.current_random = this.random_inserts[0];

        this.html_hash_table = [];
        for(i = 0; i<sizes[random_index]; i++) {
            this.html_hash_table.push("<td> <button class='table_button' onclick='check_selected_index(" + i + ")'"+ i + "'> __ </button></td>");
        }
        document.getElementById("probe").innerHTML = "<p><strong>PROBE: " + probes[random_index] + "</strong></p>";
        document.getElementById("hashFunc").innerHTML = "<p><strong>FUNCTION: (key)%" + sizes[random_index] + "</strong></p>";
        document.getElementById("probingName").innerHTML = "<p><strong>Type of Probing: Linear Probing </strong></p>";
        give_next_random();
    }

    this.next_random = function() { 
        if(this.remaining_inserts === 0) {
            return -1;
        }
        this.current_random = this.random_inserts[this.random_inserts.length - this.remaining_inserts];
        this.remaining_inserts--;
        return this.current_random;
    }

    this.check_insert = function(guess_index) {
        return this.game_hash_table.check_insert(this.current_random, guess_index, this.game_hash_table);
    }
}

function give_next_random() {
    var next = game.next_random();
    if(next === -1) {
        document.getElementById("nextRandom").innerHTML = "";
        document.getElementById("hashFunc").innerHTML = "";
        document.getElementById("probe").innerHTML = "";
        document.getElementById("message").innerHTML = "<p id='done'>Congrats! You correctly inserted all numbers! If you want to do another one, click the 'make hash table' button below.</p>";
    } else {
        document.getElementById("nextRandom").innerHTML = "<p><strong> INSERT: " + next + "</strong></p>";
    }
}

function check_selected_index(guess_index) {
    if( game.check_insert(guess_index) ) {
        document.getElementById("message").innerHTML = "";
        game.user_hash_table.insert(game.current_random, guess_index);
        game.html_hash_table[guess_index] = "<td> <button class='empty_row'>" + game.user_hash_table.table[guess_index][0]+ "</button></td>";
        draw_table();
        give_next_random();
    } else {
        //wait for user to give next guess
        document.getElementById("message").innerHTML = "<p id='wrong'>Sorry, that guess is incorrect. Please guess again.</p>";
    }
}

var sizes = [5,7,11,13,17,19];
var probes = [2,3,4,5,6,7];
var game = new Game_object(sizes, probes);

function main() {
    game.start_game();
    draw_table()
}

function draw_table() {
    var table_str = "<table id='buttons'>";
    var index_str = "<table id='index'><tr>";

    for(var i = 0; i<game.html_hash_table.length; i++) {
        index_str += "<td id='index'>" + i + "</td>";
        table_str += game.html_hash_table[i];
    }
  
    table_str += "</tr> </table> <br><br>";
    index_str += "</tr></table>";
    document.getElementById("table").innerHTML = index_str + table_str;

}