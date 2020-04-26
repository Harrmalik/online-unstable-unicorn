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

function users (state = [], action) {
    switch (action.type) {
        case 'SET_USERS': return action.users

        default:
            return state
    }
}

function decks (state = {
  drawPile: [],
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
    users,
    decks
})

export default rootReducer
