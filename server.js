var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on('startGame', (msg) => {
    console.log('start');
  });

  socket.on('drawCard', (msg) => {
    console.log('drawing card');
  });

  socket.on('playCard', (msg) => {
    console.log('play card');
  });

  socket.on('endTurn', (msg) => {
    console.log('end turn');
  });

  socket.on('endGame', (msg) => {
    console.log('end turn');
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
