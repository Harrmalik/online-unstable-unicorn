var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let connectedUsers = 0;
let servers = {
};
let lobbies = {
  'test': {
    game: {
      id: 1
    },
    decks: {},
    players: {}
  },
  'demo': {
    game: {
      id: 2
    },
    decks: {},
    players: []
  },
}
let currentGame = {};
let currentDecks = {};
let currentPlayers = [];

function getLobbies(lobbies) {
  return Object.keys(lobbies).reduce((currentLobbies, key) => {
    if (key.match(/game/ig)) {
      return [...currentLobbies, {
        key: key,
        name: key.split(':')[1],
        url: key.split(':')[1].split(' ').join(''),
        players: lobbies[key].length
      }]
    }

    return currentLobbies;
  }, []);
}

io.on('connection', (socket) => {
  if (!currentGame.id) {
    console.log(`a player connected, ${++connectedUsers} in lobby`);
    // socket.join([`game:${connectesdUsers}`])
    io.emit('userConnected', connectedUsers, testPlayers)// switch back to active users when ready
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
    console.log(getLobbies(socket.adapter.rooms))
  } else {
    console.log('new spectator');
  }
  // LOBBY EVENTS
  socket.on('getLobbies', () => {
    console.log(getLobbies(socket.adapter.rooms));
    socket.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('joinLobby', (lobbyName) => {
    socket.join([`game:${lobbyName}`]);
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('createLobby', (lobbyName) => {
    socket.join([`game:${lobbyName}`]);
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })

  socket.on('leaveLobby', (lobbyName) => {
    socket.leave([`game:${lobbyName}`]);
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  })


  // INITIALIZING GAME EVENTS
  socket.on('addPlayer', players => {
    currentPlayers = players
    io.emit('playerAdded', players)
    console.log('users in game: ', players.length);
  })

  socket.on('startGame', (game, decks, players) => {
    console.log('Starting Game')
    // if (!currentGame.turn) {
      currentGame = game;
      currentDecks = decks;
      currentPlayers = players;
    // }
    io.emit('startingGame', currentGame, currentDecks, currentPlayers)
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
    console.log(getLobbies(socket.adapter.rooms))
    socket.broadcast.emit('returnLobbies', getLobbies(socket.adapter.rooms));
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});

let testPlayers = [
  {
    id: 1,
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
      "url": "images/8.jpg"
    }],
    viewingStableId: 1,
    unicorn: {
      "id": 8,
      "name": "CANNIBAL BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "images/8.jpg",
    },
    upgrades: [],
    downgrades: []
  },{
    id: 2,
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
      "url": "images/4.jpg",
    }],
    viewingStableId: 2,
    unicorn: {
      "id": 4,
      "name": "FUCKING CUTE BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "images/4.jpg",
    },
    upgrades: [],
    downgrades: []
  },
  {
    id: 3,
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
      "url": "images/13.jpg",
    }],
    viewingStableId: 3,
    unicorn: {
      "id": 13,
      "name": "PAGEANT BABY UNICORN",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "images/13.jpg",
    },
    upgrades: [],
    downgrades: []
  },
  {
    id: 4,
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
      "url": "images/7.jpg",
    }],
    viewingStableId: 4,
    unicorn: {
      "id": 7,
      "name": "BABY UNICORN OF INCEST",
      "type": "Baby Unicorn",
      "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
      "Quantity": 1,
      "Color": "Magenta",
      "url": "images/7.jpg",
    },
    upgrades: [],
    downgrades: []
  }
]
