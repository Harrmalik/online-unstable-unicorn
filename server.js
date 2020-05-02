var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let count = 1;

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('youAre', count++);
  socket.on('add player', players => {
    io.emit('player added', players)
    console.log('users connected: ', players.length);
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
    console.log('user disconnected');
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
