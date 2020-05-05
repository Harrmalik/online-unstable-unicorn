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
  let game = {...state};
    switch (action.type) {
        case 'START_GAME':
          return {
            ...state,
            ...action.options,
            playing: true
          }

        case 'NEXT_PHASE':
        case 'END_ACTION_PHASE':
          console.log('calling next phase')
          game.phase = action.newPhase

          return game

        case 'END_TURN':
          return {
            ...game,
            ...action.gameUpdates
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
            return action.decks;

        case 'END_ACTION_PHASE':
            return action.updatedDecks;

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

function isMyTurn (state = false, action) {

    switch (action.type) {
        case 'START_GAME':
          return action.options.whosTurn.id === parseInt(action.currentPlayer)

        case 'END_TURN':
          return action.gameUpdates.whosTurn.id === parseInt(action.currentPlayer)

        default:
            return state
    }
}

function isPlayingCard (state = false, action) {
    switch (action.type) {
        case 'PLAYING_CARD':
          return action.isPlayingCard;

        case 'END_ACTION_PHASE':
          return false;

        default:
            return state
    }
}

function players (state = [], action) {
    switch (action.type) {
        case 'SET_PLAYERS':
        case 'START_GAME': return action.players;

        case 'END_ACTION_PHASE':
          return action.updatedPlayers;

        default:
            return state
    }
}

const rootReducer = combineReducers({
    socket,
    currentPlayer,
    game,
    isMyTurn,
    isPlayingCard,
    players,
    decks,
    cards
})

export default rootReducer
