const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });
const players = {};

wss.on("connection", ws => {

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    if(data.type === "init") {
      ws.playerId = data.id;
      players[ws.playerId] = [];
      console.log("Jugador conectado:", ws.playerId);
    } else if(ws.playerId) {
      players[ws.playerId] = data; // posiciones del jugador
    }
  });

  ws.on("close", () => {
    if(ws.playerId) {
      delete players[ws.playerId];
      console.log("Jugador desconectado:", ws.playerId);
    }
  });

});

// Broadcast a todos los clientes
setInterval(() => {
  const snapshot = JSON.stringify(players);
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(snapshot);
    }
  });
}, 50);
