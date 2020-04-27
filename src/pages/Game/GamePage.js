import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startGame } from 'actions';

import StableComponent from './components/Stable/StableComponent'


const ENDPOINT = "http://127.0.0.1:3001";

const hand = [{
  id: 1,
  name: 'SHOTGUN BABY UNICORN',
  type: 'Baby Unicorn',
  description: 'If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.'
},{
  id: 2,
  name: 'BYE BYE BABY UNICORN',
  type: 'Baby Unicorn',
  description: 'If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.'
},{
  id: 3,
  name: 'DUMPSTER BABY UNICORN',
  type: 'Baby Unicorn',
  description: 'If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.'
},]

function GamePage(props) {
  // DECK would be props.decks.drawPile
  const deck = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

  // PLAYERS would be props.users
  const players = [{
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
  }];
  // shuffle deck
function shuffle (deck) {
  var i = 0
    , j = 0
    , temp = null

  for (i = deck.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
}
// deal the deck to the players
function deal(deck) {
  let dealAmount = players.length < 6 ? 5 : 6;
  for (let i = 0; i < (players.length * dealAmount); i++ ){
    const playerIndex = i % players.length;
    const card = deck.splice(0,1)[0];
    players[playerIndex].hand.push(card);
  }
}

  shuffle(deck);
  deal(deck);

  const playerBullshit = players.map(player =>
    <p>{player.name}'s hand: {player.hand.join(',')}</p>
  );

  const deckBS = `Remaining cards: ${deck.join(',')}`;

  return (
    <div style={{display: !props.game.playing ? 'none' : 'block'}}>
    {deckBS}
    {playerBullshit}
      // Each should be a separate component
      //////////////////////////////////////



      // props.usersUI -> user avatar + num cards in hands
      // Decks UI [draw, nursery, discard]

      <StableComponent hand={hand}/>
      // stables -> cards in play for each user
      // My hand -> cards view -> quick view and click for more details
      // Options -> for later
    </div>
  );
}


// deal the deck to the props.users


// NOTES
//-------------


// Reducers folder -> contains state object for entire App
// Action folder -> contains functions to be imported from -> import { setUsers, startGame } from './../../actions';
// mapStateToProps maps the state object from reducers to be used in a component
// mapDispatchToProps maps actions to be called in a component
// To call a dispatch user `props.[functionName]`
// socketIOClient.emit('functionName') for later user but an FYI

const mapStateToProps = state => ({
  players: state.players,
  game: state.game,
  decks: state.decks
})

const mapDispatchToProps = dispatch => ({
    startGame: bindActionCreators(startGame, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
