var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let connectedUsers = 0;
let testPlayers = [
  {
    id: 1,
    connected: true,
    color: 'purple',
    name: "tyler",
    hand: [],
    stable: [{
      "id": 8,
      "name": "CANNIBAL BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/8.jpg"
    }],
    viewingStableId: 1,
    unicorn: {
      "id": 8,
      "name": "CANNIBAL BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/8.jpg",
    },
    upgrades: [],
    downgrades: []
  },{
    id: 2,
    connected: true,
    name: "Malik",
    color: 'blue',
    hand: [],
    stable: [{
      "id": 4,
      "name": "FUCKING CUTE BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/4.jpg",
    }],
    viewingStableId: 2,
    unicorn: {
      "id": 4,
      "name": "FUCKING CUTE BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/4.jpg",
    },
    upgrades: [],
    downgrades: []
  },
  {
    id: 3,
    connected: true,
    name: "Liz",
    color: 'teal',
    hand: [],
    stable: [{
      "id": 13,
      "name": "PAGEANT BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/13.jpg",
    }],
    viewingStableId: 3,
    unicorn: {
      "id": 13,
      "name": "PAGEANT BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/13.jpg",
    },
    upgrades: [],
    downgrades: []
  },
  {
    id: 4,
    connected: true,
    color: 'green',
    name: "Troy",
    hand: [],
    stable: [{
      "id": 7,
      "name": "BABY UNICORN OF INCEST",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/7.jpg",
    }],
    viewingStableId: 4,
    unicorn: {
      "id": 7,
      "name": "BABY UNICORN OF INCEST",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "/images/7.jpg",
    },
    upgrades: [],
    downgrades: []
  }
]
// let lobbies = [];
let games = {
  'unicornsarelit': {
    currentGame: {},
    currentDecks: {},
    currentPlayers: testPlayers
  }
}

function getLobbies(lobbies) {
  return Object.keys(lobbies).reduce((currentLobbies, key) => {
    if (key.match(/game/ig)) {
      return [...currentLobbies, {
        key: key,
        name: key.split(':')[1],
        uri: removeSpaces(key.split(':')[1]),
        players: lobbies[key].length
      }]
    }

    return currentLobbies;
  }, []);
}

function returnLobbies(updated) {
  lobbies = getLobbies(socket.adapter.rooms)
  socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
}

function removeSpaces(string) {
  return string.split(' ').join('');
}

function encodeUriToRoomId(uri) {
  return `game:${uri}`;
}

function findLobby(uri) {
  const roomId = encodeUriToRoomId(uri);
  return
}

io.on('connection', (socket) => {
  socket.join([`game:unicornsarelit`])
  lobbies = getLobbies(socket.adapter.rooms)
  socket.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  // if (!currentGame.id) {
  //   console.log(`a player connected, ${++connectedUsers} in lobby`);
  //
  //   socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  //   console.log(getLobbies(socket.adapter.rooms))
  // } else {
  //   console.log('new spectator');
  // }



  // LOBBY EVENTS
  socket.on('getLobbies', () => {
    socket.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('joinLobby', (lobbyName) => {
    const room = `game:${lobbyName}`;
    socket.join([room]);
    lobbies = getLobbies(socket.adapter.rooms);
    currentLobby = lobbies.find(l => l.key === room)
    io.to(room).emit('userConnected', currentLobby.players, games[lobbyName].currentPlayers.filter((testPlayer, index) => index < currentLobby.players))// switch back to active users when ready
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('createLobby', (lobbyName) => {
    socket.join([`game:${lobbyName}`]);
    games[removeSpaces(lobbyName)] = {
      currentGame: {},
      currentDecks: {},
      currentPlayers: []
    }
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('leaveLobby', (lobbyName) => {
    const room = `game:${lobbyName}`;
    socket.leave([room]);
    lobbies = getLobbies(socket.adapter.rooms);
    currentLobby = lobbies.find(l => l.key === room);
    if (currentLobby) {
      io.to(room).emit('userConnected', currentLobby.players, games[lobbyName].currentPlayers.filter((testPlayer, index) => index < currentLobby.players))
    } else {
      delete games[lobbyName]
    }
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('checkForRoom', uri => {
    let lobbies = getLobbies(socket.adapter.rooms);
    const lobby = lobbies.find(l => l.uri === uri)
    socket.emit('reconnect', lobby, games[uri]);
  })


  // INITIALIZING GAME EVENTS
  socket.on('addPlayer', (lobbyName, players) => {
    console.log('adding player')
    console.log(`players in ${lobbyName}: ${players.length}`);
    const room = `game:${lobbyName}`;
    games[lobbyName].currentPlayers = players
    io.to(room).emit('playerAdded', players)
  })

  socket.on('startGame', (lobbyName, game, decks, players) => {
    console.log('Starting Game')
    const room = `game:${lobbyName}`;
    games[lobbyName].currentGame = game;
    games[lobbyName].currentDecks = decks;
    games[lobbyName].currentPlayers = players;
    io.to(room).emit('startingGame', currentGame, currentDecks, currentPlayers)
  });


  // GAME EVENTS
  socket.on('endEffectPhase', phase => {
    if (currentGame.phase === 0) {
      console.log('Switching to ', phase, ' phase');
      currentGame.phase = phase
      io.emit('switchingPhase', phase);
    }
  })

  socket.on('drawCard', (decks, players, phase) => {
    if ([1,2].includes(currentGame.phase))
    console.log('drawing card');
    currentDecks.drawPile = decks;
    currentPlayers = players;
    currentGame.phase = phase;
    io.emit('cardDrew', currentDecks, currentPlayers);
    if (phase) {
      io.emit('switchingPhase', phase);
    }
  });

  socket.on('playCard', (card, updatedPlayers) => {
    console.log('Attemping to play: ', card.name)
    io.emit('attemptCardPlay', card, updatedPlayers);
  });

  socket.on('skippingInstant', player => {
    console.log('skippingInstant');
    io.emit('playerCheckedForInstant', player);
  })

  socket.on('endActionPhase', (phase, updatedDecks, updatedPlayers) => {
    if (currentGame.phase === 2) {
      console.log('card played');
      currentGame.phase = phase;
      currentPlayers = updatedPlayers;
      currentDecks = updatedDecks;
      io.emit('endingActionPhase', phase, updatedDecks, updatedPlayers);
    }
  });

  socket.on('endTurn', (gameUpdates) => {
    if (currentGame.phase === 3) {
      console.log('Ending turn');
      currentGame = {
        ...currentGame,
        ...gameUpdates,
        phase: 0
      }
      io.emit('endingTurn', gameUpdates);
    }
  });

  socket.on('endGame', (msg) => {
    console.log('end turn');
  });

  socket.on('disconnect', () => {
    console.log(`a player left, ${--connectedUsers} in lobby`);
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
