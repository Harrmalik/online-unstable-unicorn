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
    viewingOtherPlayerModalId: 1,
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
    downgrades: [{
      name: 'skipPhase',
      description: 'Skip either your Draw phase or your Action phase.',
      optional: false
    }]
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
    viewingOtherPlayerModalId: 2,
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
    viewingOtherPlayerModalId: 3,
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
    viewingOtherPlayerModalId: 4,
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



  // HOMEPAGE EVENTS
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

  socket.on('checkForRoom', lobbyName => {
    const room = `game:${lobbyName}`;
    console.log(lobbyName);

    if (games[lobbyName]) {
      console.log('found lobby')
      socket.join([room]);
      lobbies = getLobbies(socket.adapter.rooms);
      currentLobby = lobbies.find(l => l.key === room);

      if (games[lobbyName].currentGame.playing) {
        console.log('reconnect to game')
        io.to(room).emit('reconnect', games[lobbyName].currentGame, games[lobbyName].currentDecks, games[lobbyName].currentPlayers)
      } else {
        games[lobbyName].currentPlayers.filter((testPlayer, index) => index < currentLobby.players)
        console.log(`Players: ${games[lobbyName].currentPlayers.length}, connected: ${currentLobby.players}`);
        socket.emit('reconnect', currentLobby.players, games[lobbyName]);
      }
    } else {
      console.log('no lobby found')
      socket.emit('reconnect', null, null);
    }
  })


  // LOBBY PAGE EVENTS
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

  socket.on('addPlayer', (lobbyName, newPlayer) => {
    console.log('adding player')
    const room = `game:${lobbyName}`;
    games[lobbyName].currentPlayers.push(newPlayer);
    console.log(`players in ${lobbyName}: ${games[lobbyName].currentPlayers.length}`);
    io.to(room).emit('playerAdded', games[lobbyName].currentPlayers)
  })

  socket.on('startGame', (lobbyName, game, decks, players) => {
    console.log('Starting Game')
    const room = `game:${lobbyName}`;
    games[lobbyName].currentGame = game;
    games[lobbyName].currentDecks = decks;
    games[lobbyName].currentPlayers = players;
    io.to(room).emit('startingGame', games[lobbyName].currentGame, games[lobbyName].currentDecks, games[lobbyName].currentPlayers)
  });


  // GAME EVENTS
  socket.on('endEffectPhase', (lobbyName, phase) => {
    if (games[lobbyName].currentGame.phase === 0) {
      console.log('Switching to ', phase, ' phase');
      games[lobbyName].currentGame.phase = phase
      io.to(`game:${lobbyName}`).emit('switchingPhase', phase);
    }
  })

  socket.on('drawCard', (lobbyName, decks, players, phase) => {
    console.log('drawing card');
    games[lobbyName].currentDecks = decks;
    games[lobbyName].currentPlayers = players;
    games[lobbyName].currentGame.phase = phase;
    io.to(`game:${lobbyName}`).emit('cardDrew', games[lobbyName].currentDecks, games[lobbyName].currentPlayers);
    if (phase) {
      io.to(`game:${lobbyName}`).emit('switchingPhase', phase);
    }
  });

  socket.on('attemptToPlayCard', (lobbyName, card) => {
    console.log('Attemping to play: ', card.name)
    io.to(`game:${lobbyName}`).emit('attemptCardPlay', card);
  });

  socket.on('playCard', (lobbyName, updatedPlayers) => {
    console.log('Attemping to play: ', card.name)
    io.to(`game:${lobbyName}`).emit('cardPlayed', card, updatedPlayers);
  });

  socket.on('discardCard', (lobbyName, card, updatedDecks, updatedPlayers) => {
    console.log('Discarding Card')
    io.to(`game:${lobbyName}`).emit('cardDiscarded', card, updatedDecks, updatedPlayers);
  });

  socket.on('destroyCard', (lobbyName, card, updatedDecks, updatedPlayers) => {
    console.log('Destroying Card')
    io.to(`game:${lobbyName}`).emit('cardDestroyed', card, updatedDecks, updatedPlayers);
  });

  socket.on('sacrificeCard', (lobbyName, card, updatedDecks, updatedPlayers) => {
    console.log('Sacrificing Card')
    io.to(`game:${lobbyName}`).emit('cardSacrificed', card, updatedDecks, updatedPlayers);
  });

  socket.on('returnCard', (lobbyName, card, updatedDecks, updatedPlayers) => {
    console.log('Returning Card')
    io.to(`game:${lobbyName}`).emit('cardReturned', card, updatedDecks, updatedPlayers);
  });

  socket.on('skippingInstant', (lobbyName, playerIndex) => {
    console.log('skippingInstant');
    io.to(`game:${lobbyName}`).emit('playerCheckedForInstant', playerIndex);
  })

  socket.on('playInstant', (lobbyName, playerIndex, instant) => {
    console.log('playingIntent: ', instant.name);
    io.to(`game:${lobbyName}`).emit('playerCheckedForInstant', playerIndex, instant);
  })

  socket.on('actionHappened', (lobbyName, updatedDecks, updatedPlayers) => {
    console.log('card played');
    games[lobbyName].currentPlayers = updatedPlayers;
    games[lobbyName].currentDecks = updatedDecks;
    io.to(`game:${lobbyName}`).emit('updateFromAction', updatedDecks, updatedPlayers);
  });

  socket.on('endActionPhase', (lobbyName) => {
    console.log('ENDING ACTION PHASE');
    games[lobbyName].currentGame.phase = 3
    io.to(`game:${lobbyName}`).emit('endingActionPhase');
  });

  socket.on('endTurn', (lobbyName, gameUpdates, nextPlayerIndex) => {
    console.log(games[lobbyName].currentGame.phase)
    if (games[lobbyName].currentGame.phase === 3) {
      console.log('Ending turn');
      games[lobbyName].currentGame = {
        ...games[lobbyName].currentGame,
        ...gameUpdates
      }

      io.to(`game:${lobbyName}`).emit('endingTurn', gameUpdates, nextPlayerIndex);
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
