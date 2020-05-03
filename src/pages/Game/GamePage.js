import React, { useState, useEffect } from "react";
import './GamePage.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startGame } from 'actions';
import StableComponent from './components/Stable/StableComponent';
import HandComponent from './components/Hand/HandComponent';
import Field from './components/Field/Field.js';
import ActionViewComponent from './components/ActionView/ActionViewComponent.js';
import PlayersView from 'components/PlayersView/PlayersView.js';

function GamePage(props) {
  if (props.game.playing) {
    return (
      <div style={{display: !props.game.playing ? 'none' : 'block'}}>

        {/* // Each should be a separate component

          - props.usersUI -> user avatar + num cards in hands
          - Decks UI [draw, nursery, discard]
          - stables -> cards in play for each user
          - My hand -> cards view -> quick view and click for more details
          - Options -> for later */}
          <PlayersView players={props.players}/>
          <Field player={props.players[props.currentPlayer - 1]}></Field>
          <ActionViewComponent/>
          <HandComponent hand={props.players[props.currentPlayer - 1].hand}/>
      </div>
    );
  }

  return null
}

// NOTES
//-------------


// Reducers folder -> contains state object for entire App
// Action folder -> contains functions to be imported from -> import { setUsers, startGame } from './../../actions';
// mapStateToProps maps the state object from reducers to be used in a component
// mapDispatchToProps maps actions to be called in a component
// To call a dispatch user `props.[functionName]`
// socketIOClient.emit('functionName') for later user but an FYI

const mapStateToProps = state => ({
  currentPlayer: state.currentPlayer,
  players: state.players,
  game: state.game,
  decks: state.decks,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    startGame: bindActionCreators(startGame, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
