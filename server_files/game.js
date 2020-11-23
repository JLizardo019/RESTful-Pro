
let url_base = "localhost:3000";

// setup game
setupGame();

async function setupGame(){
    const response  = await fetch(`http://${url_base}/start`);
    const result = await response.json();

    establishWebSocket(result.session);

}

// establish websocket
function establishWebSocket(session){
    console.log(session);

    // web sockets
    const url = `ws://${url_base}/${session}`;
    const connection = new WebSocket(url);

    connection.onopen = () => {
        //...
        console.log("connection established");
        connection.send("Room full?");

    }

    connection.onmessage = e => {
        console.log(e.data);
        if (e.data=="true"){
            alert("start");
        }
        else{
            alert("not yet");
            connection.send("Room full?");
        }
    }

    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`)
    }
}








// get references
const boxes = document.querySelectorAll(".box");
const play_report = document.getElementById("player");
const winner = document.getElementById("winner");

let player = 1;
let empty = boxes.length;
let gameOver= false;

// look at each box
boxes.forEach(function(b, pos){
    b.onclick = function(){
        
        // make sure it is an empty box
        if (b.innerText === "_" && gameOver === false){
            
            empty -=1;

            // decide which player it is
            if (player === 1){
                b.innerText = "X";
                connection.send(["X", pos]);
                play_report.innerText = "Player's 2 Turn:";
                player=2;
            }
            else{
                b.innerText = "O";
                console.log(boxes);
                connection.send(boxes);
                play_report.innerText = "Player's 1 Turn:";
                player=1;
            }
        }

        //see if anyone has won yet

        //player 1
        if ((boxes[0].innerText+""+boxes[1].innerText+boxes[2].innerText)==="XXX" || (boxes[3].innerText+boxes[4].innerText+boxes[5].innerText)==="XXX"
        || (boxes[6].innerText+boxes[7].innerText+boxes[8].innerText)==="XXX" || (boxes[0].innerText+boxes[3].innerText+boxes[6].innerText)==="XXX" 
        || (boxes[1].innerText+boxes[4].innerText+boxes[7].innerText)==="XXX" || (boxes[2].innerText+boxes[5].innerText+boxes[8].innerText)==="XXX"
        || (boxes[0].innerText+boxes[4].innerText+boxes[8].innerText)==="XXX" || (boxes[2].innerText+boxes[4].innerText+boxes[6].innerText)==="XXX")
        {
            winner.innerText = "Player 1 wins!";
            gameOver= true;
            document.body.style.backgroundImage = "url(confetti.gif)";
        }
        //player 2
        else if ((boxes[0].innerText+""+boxes[1].innerText+boxes[2].innerText)==="OOO" || (boxes[3].innerText+boxes[4].innerText+boxes[5].innerText)==="OOO"
        || (boxes[6].innerText+boxes[7].innerText+boxes[8].innerText)==="OOO" || (boxes[0].innerText+boxes[3].innerText+boxes[6].innerText)==="OOO" 
        || (boxes[1].innerText+boxes[4].innerText+boxes[7].innerText)==="OOO" || (boxes[2].innerText+boxes[5].innerText+boxes[8].innerText)==="OOO"
        || (boxes[0].innerText+boxes[4].innerText+boxes[8].innerText)==="OOO" || (boxes[2].innerText+boxes[4].innerText+boxes[6].innerText)==="OOO")
        {
            winner.innerText = "Player 2 wins!";
            gameOver= true;
            document.body.style.backgroundImage = "url(confetti.gif)";
        }
        // draw
        else if (empty===0){
            winner.innerText = "It is a tie!";
            gameOver= true;
        }
    }
    
});

function reset() { // reset game variables
    boxes.forEach(function(b) {
        b.innerText = "_";
    });
    gameOver= false;
    empty = boxes.length;
    player=1;
    document.body.style.backgroundImage = "";
    winner.innerText="";
    play_report.innerText = "Player's 1 Turn:";
}