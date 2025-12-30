const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

const players = {};

wss.on("connection", ws => {

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if(data.type === "init"){
      ws.playerId = data.id;

      players[ws.playerId] = {
        id: data.id,
        name: data.name,
        score: 0,
        alive: true,
        body: []
      };


      console.log("Jugador:", data.name);
    }

    else if(ws.playerId){
      players[ws.playerId].body = data;
      players[ws.playerId].score = data[0].score;
    }
  });

  ws.on("close",()=>{
    if(ws.playerId){
      players[ws.playerId].alive = false;
    }
  });
});

// -------- BROADCAST --------
setInterval(()=>{
  const ranking = Object.values(players)
    .sort((a,b)=>b.score-a.score)
    .slice(0,10)
    .map(p=>({ name:p.name, score:p.score }));

  const snapshot = JSON.stringify({
    players,
    ranking
  });

  wss.clients.forEach(c=>{
    if(c.readyState === WebSocket.OPEN){
      c.send(snapshot);
    }
  });
},50);
