import React from 'react';
import logo from './logo.svg';
import './App.css';
import store from './store.js';
import { Provider } from 'react-redux';

import HomePage from './pages/Home/HomePage.js';
import GamePage from './pages/Game/GamePage.js';
const ENDPOINT = "/3001";

console.log(store.getState())
store.subscribe(() =>
  console.log(store.getState())
)


function App() {
  let state = store.getState()
  return (
    <Provider store={store}>
      <div className="App">
        <HomePage/>
        <GamePage/>
      </div>
    </Provider>
  );
}

export default App;


// Gather all baby unicorns from the deck and place 1 in the stable of each player. Place the rest of the baby unicorns in a stack. this will be your nursery.
