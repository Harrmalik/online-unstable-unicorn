export const setCurrentPlayer = (player) => ({
    type: 'SET_PLAYER',
    player
})

export const setPlayers = (players) => ({
    type: 'SET_PLAYERS',
    players
})

export const startGame = (options, decks, players) => ({
    type: 'START_GAME',
    options,
    decks,
    players
})

export const addToInPlay = ({
  users,
  options
}) => ({
    type: 'START_GAME',
    options
})
