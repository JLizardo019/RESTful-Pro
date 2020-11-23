const dotenv = require("dotenv").config();
const fs = require('fs').promises;

// express server
const express=require("express"); 
const app = express();
app.use(express.static(__dirname+'/public'));

// websocket
var expressWs = require('express-ws')(app);
const dir = __dirname;



app.get("/game", (req,res) =>{
    console.log("got request2");
    res.sendFile(dir+"/server_files/game.html");
});
app.get("/game.css", (req,res) =>{
    console.log("got request2");
    res.sendFile(dir+"/server_files/game.css");
});

app.get("/game.js", (req,res) =>{
    res.sendFile(dir+"/server_files/game.js");
    
});

app.get("/start", async (req,res)=>{ 
    // find an available session, otherwise make one
    const rawdata = await fs.readFile('db.json');
    const db = await JSON.parse(rawdata);
    
    let id = null;

    for (let key in db){
        let players = db[key].players;
        if (players===1){
            id = key;
            db[key].players = 2;
            break;
        }
    }

    if (!id){ // all sessions are full, make a new one
        const keys = Object.keys(db);
        id = makeNewSession(keys);

        db[id] = { // add new entry in db
            "players": 1,
            "data": []
        }
 
    }

    // update db
    const data = JSON.stringify(db,null,2);
    await fs.writeFile("db.json",data);

    res.json({session: id});

});

app.ws('/:session', (ws, req) => {
    // find session an update
    // console.log(req.params);
    ws.on('message', async function(msg) {
        const id = req.params.session;
        const rawdata = await fs.readFile('db.json');
        const db = await JSON.parse(rawdata);
        console.log(msg);

        if (msg === "Room full?"){
            if (db[id].players ===2){
                ws.send("true");
            }
            else{
                ws.send("false");
            }
        }
        
      
    });
});

app.get('/sessionStatus:id', async (req, res)=>{
    const id = req.params.id;
    const rawdata = await fs.readFile('db.json');
    const db = await JSON.parse(rawdata);
    res.send(db.id.players);
});

app.get('/clients', (req, res)=>{
    let num = expressWs.getWss().clients;
    console.log(num);
    res.send(num);
});








app.listen(3000, ()=> {
    console.log("listening on port localhost:3000");
  });

function makeNewSession(keys){

    let newId = "";

    while (true){

        for (let i=0; i<6; i++){
            let random_Letter = 65 + Math.floor(Math.random()*26);
            newId += String.fromCharCode(random_Letter);
        }
    
        if(keys.includes(newId)){ // make sure the new id doesn't already exist
            console.log("here");
        }
        else{
            break;
        }
    }

    return newId;
}