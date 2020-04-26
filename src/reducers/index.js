import { combineReducers } from 'redux'
let defaultOptions = {
  gameId: 0,
  gameDuration: '',
  expansion: '',
  winCondition: ''
}


function game (state = {}, action) {
    switch (action.type) {
        case 'START_GAME': return {
          ...action.options,
          playing: true
        }

        default:
            return state
    }
}

function options (state = defaultOptions, action) {
    switch (action.type) {
        default:
            return state
    }
}

function players (state = [{
  id: 1,
  name: "tyler",
  hand: [],
},{
  id: 2,
  name: "Malik",
  hand: [],
},{
  id: 3,
  name: "Liz",
  hand: [],
}], action) {
    switch (action.type) {
        case 'SET_PLAYERS': return action.players

        default:
            return state
    }
}

function decks (state = {
  drawPile: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  nursery: [],
  discardPile: []
}, action) {
    switch (action.type) {
        case 'UPDATE_DECKS':
            return action.desks

        case 'UPDATE_DRAWPILE':
            return decks.drawPile = action.deck

        case 'UPDATE_NURSERY':
            return decks.nursery = action.deck

        case 'UPDATE_DISCARDPILE':
            return decks.discardPile = action.deck

        default:
            return state
    }
}

const rootReducer = combineReducers({
    game,
    options,
    players,
    decks
})

export default rootReducer
