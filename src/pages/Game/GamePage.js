import React from "react";
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
  let currentPlayer = props.players[props.currentPlayer - 1];
  let stablePlayer = props.players.find(player => player.id == currentPlayer.viewingStableId);
  if (props.game.playing) {
    return (
      <div style={{display: !props.game.playing ? 'none' : 'block'}}>
          <PlayersView players={props.players}/>
          <Field player={currentPlayer}></Field>
          <ActionViewComponent/>
          <HandComponent hand={currentPlayer.hand}/>
          <StableComponent playerName={stablePlayer.name} stable={stablePlayer.stable}/>
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
