import React from 'react';
import './App.css';
import store from './store.js';
import { Provider } from 'react-redux';

import HomePage from './pages/Home/HomePage.js';
import GamePage from './pages/Game/GamePage.js';

console.log(store.getState())
store.subscribe(() =>
  console.log(store.getState())
)


function App() {
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
