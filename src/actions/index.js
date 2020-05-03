export const setCurrentPlayer = (player) => ({
    type: 'SET_PLAYER',
    player
})

export const setPlayers = (players) => ({
    type: 'SET_PLAYERS',
    players
})

export const startGame = (options, decks, players, currentPlayer) => ({
    type: 'START_GAME',
    options,
    decks,
    players,
    currentPlayer
})

export const updateDecks = (decks) => ({
    type: `UPDATE_DECKS`,
    decks
})

export const updateHand = (player) => ({
    type: 'UPDATE_HAND',
    player
})

export const nextPhase = () => ({
    type: 'UPDATE_HAND'
})

export const addToInPlay = ({
  users,
  options
}) => ({
    type: 'START_GAME',
    options
})
