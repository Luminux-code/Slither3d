const WebSocket = require("ws");
const wss = new WebSocket.Server({port:3000});
console.log("Servidor WebSocket en puerto 3000");

const players = {};

wss.on("connection", ws=>{
  const id = Date.now()+Math.random();
  players[id]=[];

  ws.on("message", msg=>{
    const data = JSON.parse(msg); // data = [cabeza, seg1, seg2,...]
    players[id]=data;
  });

  ws.on("close",()=>{ delete players[id]; });

  const interval = setInterval(()=>{
    ws.send(JSON.stringify(players));
  },50);

  ws.on("close",()=>clearInterval(interval));
});
