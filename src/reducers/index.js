import { combineReducers } from 'redux';
import cards from './cards.js';
import socketIOClient from "socket.io-client";

let defaultOptions = {
  gameid: 0,
  gameDuration: '',
  expansion: '',
  winCondition: ''
};
const socketServer = socketIOClient("http://127.0.0.1:3001");

function socket (state = socketServer, action) {
    switch (action.type) {
        default:
            return state
    }
}

function currentPlayer (state = '', action) {
    switch (action.type) {
        case 'SET_PLAYER': return action.player;
        default:
            return state
    }
}

function game (state = {
  playing: false,
  phase: 0,
  phases: [{
    name: 'Effect',
    actions: ['checkForEffects']
  }, {
    name: 'Draw',
    actions: ['drawCard']
  }, {
    name: 'Action',
    actions: ['playCard', 'drawCard']
  }, {
    name: 'EndTurn',
    actions:['endTurn']
  }],
  cards,
  whosTurn: {},
  turn: 1
}, action) {
    switch (action.type) {
        case 'START_GAME':
        return {
          ...state,
          ...action.options,
          playing: true
        }

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
            return action.decks

        case 'UPDATE_DRAWPILE':
            return decks.drawPile = action.deck

        case 'UPDATE_NURSERY':
            return decks.nursery = action.deck

        case 'UPDATE_DISCARDPILE':
            return decks.discardPile = action.deck

        case 'DRAW_CARD':



        default:
            return state
    }
}

function isMyTurn (state = defaultOptions, action) {

    switch (action.type) {
        case 'START_GAME':
          return action.options.whosTurn.id === parseInt(action.currentPlayer)
        default:
            return state
    }
}

function players (state = [], action) {
    switch (action.type) {
        case 'SET_PLAYERS':
        case 'START_GAME': return action.players

        default:
            return state
    }
}

const rootReducer = combineReducers({
    socket,
    currentPlayer,
    game,
    isMyTurn,
    players,
    decks,
    cards
})

export default rootReducer
