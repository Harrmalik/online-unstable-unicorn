import { combineReducers } from 'redux'
import cards from './cards.js'

let defaultOptions = {
  gameid: 0,
  gameDuration: '',
  expansion: '',
  winCondition: ''
}


function game (state = {playing: false, cards}, action) {
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
  color: 'purple',
  name: "tyler",
  hand: [{
    "id": 8,
    "name": "CANNIBAL BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 8,
    "name": "CANNIBAL BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
},{
  id: 2,
  name: "Malik",
  color: 'blue',
  hand: [{
    "id": 4,
    "name": "FUCKING CUTE BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 4,
    "name": "FUCKING CUTE BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
},{
  id: 3,
  name: "Liz",
  color: 'teal',
  hand: [{
    "id": 13,
    "name": "PAGEANT BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 13,
    "name": "PAGEANT BABY UNICORN",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
},{
  id: 4,
  color: 'green',
  name: "Troy",
  hand: [{
    "id": 7,
    "name": "BABY UNICORN OF INCEST",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }],
  stable: [],
  unicorn: {
    "id": 7,
    "name": "BABY UNICORN OF INCEST",
    "type": "Baby Unicorn",
    "description": "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
    "Quantity": 1,
    "Color": "Magenta"
  }
}], action) {
    switch (action.type) {
        case 'SET_PLAYERS':
        case 'START_GAME': return action.players

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
        case 'START_GAME':
            console.log(action)
            return action.decks

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
    decks,
    cards
})

export default rootReducer
