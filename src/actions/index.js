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

export const updateDeck = (deck) => ({
    type: 'UPDATE_DECK',
    deck
})

export const updateHand = (player) => ({
    type: 'UPDATE_HAND',
    player
})

export const addToInPlay = ({
  users,
  options
}) => ({
    type: 'START_GAME',
    options
})
