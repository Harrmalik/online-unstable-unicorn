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
          <PlayersView players={props.players}/>
          <Field player={props.players[props.currentPlayer - 1]}></Field>
          <ActionViewComponent/>
          <HandComponent hand={props.players[props.currentPlayer - 1].hand}/>
          <StableComponent stable={props.players[props.currentPlayer - 1].stable}/>
      </div>
    );
  }

  return null
}

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
