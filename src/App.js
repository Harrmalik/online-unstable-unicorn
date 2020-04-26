import React from 'react';
import logo from './logo.svg';
import './App.css';



function App() {
  // consts
  const deck = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {deckBS}
        {playerBullshit}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// const deck = [{
//   id: 1,
//   title: "This is the name of the card",
//   Description: "Rando shit about drugs and unicorn sex",
//   type: "magical Unicorn"
// }]

export default App;
