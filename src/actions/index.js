// Socket Actions
export const joinLobby = (lobby) => ({
    type: 'JOIN_LOBBY',
    lobby
})

export const leaveLobby = () => ({
    type: 'LEAVE_LOBBY'
})

// Current player actions
export const setCurrentPlayer = (player) => ({
    type: 'SET_PLAYER',
    player
})


// Game actions
export const startGame = (options, decks, players, isMyTurn) => ({
    type: 'START_GAME',
    options,
    decks,
    players,
    isMyTurn
})

export const nextPhase = (newPhase) => ({
    type: 'NEXT_PHASE',
    newPhase
})

export const viewStable = (currentPlayer, viewingPlayer) => (
    {
    type: 'VIEW_STABLE',
    currentPlayer,
    viewingPlayer
});

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
