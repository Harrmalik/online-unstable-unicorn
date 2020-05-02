var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


let testPlayers = [
{
  id: 1,
  color: 'purple',
  name: "tyler",
  hand: [{
    "id": 8,
    "name": "CANNIBAL BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 8,
    "name": "CANNIBAL BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
},{
  id: 2,
  name: "Malik",
  color: 'blue',
  hand: [{
    "id": 4,
    "name": "FUCKING CUTE BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 4,
    "name": "FUCKING CUTE BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
},{
  id: 3,
  name: "Liz",
  color: 'teal',
  hand: [{
    "id": 13,
    "name": "PAGEANT BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 13,
    "name": "PAGEANT BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
},{
  id: 4,
  color: 'green',
  name: "Troy",
  hand: [{
    "id": 7,
    "name": "BABY UNICORN OF INCEST",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 7,
    "name": "BABY UNICORN OF INCEST",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
}]
let connectedUsers = 0;
let activePlayers = [];

io.on('connection', (socket) => {
  console.log(`a player connected, ${++connectedUsers} in lobby`);
   io.emit('userConnected', connectedUsers, testPlayers) // switch back to active users when ready

  socket.on('addPlayer', players => {
    activePlayers = players
    io.emit('playerAdded', players)
    console.log('users in game: ', players.length);
  })
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on('startGame', (options, decks, players) => {
    io.emit('startingGame', options, decks, players)
  });

  socket.on('drawCard', (msg) => {
    console.log('drawing card');
  });

  socket.on('playCard', (card) => {
    console.log('play card');
  });

  socket.on('endTurn', (msg) => {
    console.log('end turn');
  });

  socket.on('endGame', (msg) => {
    console.log('end turn');
  });

  socket.on('disconnect', () => {
    console.log(`a player left, ${--connectedUsers} in lobby`);
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
