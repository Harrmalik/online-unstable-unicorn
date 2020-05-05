// Current player actions
export const setCurrentPlayer = (player) => ({
    type: 'SET_PLAYER',
    player
})


// Game actions
export const startGame = (options, decks, players, currentPlayer) => ({
    type: 'START_GAME',
    options,
    decks,
    players,
    currentPlayer
})

export const nextPhase = (newPhase) => ({
    type: 'NEXT_PHASE',
    newPhase
})

export const endActionPhase = (newPhase, updatedDecks, updatedPlayers) => ({
    type: 'END_ACTION_PHASE',
    newPhase,
    updatedDecks,
    updatedPlayers
})

export const endTurn = (gameUpdates, currentPlayer) => ({
    type: 'END_TURN',
    gameUpdates,
    currentPlayer
})


// Deck Actions
export const updateDecks = (decks) => ({
    type: `UPDATE_DECKS`,
    decks
})

export const updateHand = (player) => ({
    type: 'UPDATE_HAND',
    player
})

// Player actions
export const setPlayers = (players) => ({
    type: 'SET_PLAYERS',
    players
})

export const playCard = ({
  users,
  options
}) => ({
    type: 'START_GAME',
    options
})

export const playingCard = (isPlayingCard) => ({
    type: 'PLAYING_CARD',
    isPlayingCard
})
