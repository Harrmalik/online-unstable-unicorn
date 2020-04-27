import React from "react";
import { connect } from 'react-redux';

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
function deal(deck, players) {
  let dealAmount = players.length < 6 ? 5 : 6;
  for (let i = 0; i < (players.length * dealAmount); i++ ){
    const playerIndex = i % players.length;
    const card = deck.splice(0,1)[0];
    players[playerIndex].hand.push(card);
  }
}

function GameInitialization(props) {
  shuffle(props.decks.drawPile);
  deal(props.decks.drawPile, props.players);

  const playerBullshit = props.players.map(player =>
    <p>{player.name}'s hand: {player.hand.join(',')}</p>
  );

  const deckBS = `Remaining cards: ${props.decks.drawPile.join(',')}`;

  return (
    <div>
        {deckBS}
        {playerBullshit}
    </div>
  )
}

const mapStateToProps = state => ({
  players: state.players,
  decks: state.decks
})
  
export default connect(
  mapStateToProps
)(GameInitialization)