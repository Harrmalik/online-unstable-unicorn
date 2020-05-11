import React, { useState } from "react";
import './GamePage.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startGame, viewStable } from 'actions';
import StableComponent from './components/Stable/StableComponent';
import HandComponent from './components/Hand/HandComponent';
import Field from './components/Field/Field.js';
import ActionViewComponent from './components/ActionView/ActionViewComponent.js';
import ViewOtherPlayer from './components/ViewOtherPlayer/ViewOtherPlayer.js';
import PlayersView from 'components/PlayersView/PlayersView.js';

function GamePage(props) {
  const currentPlayer = props.players.find(player => player.id == props.currentPlayer);
  const [isViewingOtherPlayer, setIsViewingOtherPlayer] = useState(false);
  const [playerToView, setPlayerToView] = useState(false);

  function viewPlayer (selectedPlayer) {
    if (currentPlayer.id == selectedPlayer.id) {
      setIsViewingOtherPlayer(false);
      props.viewStable(currentPlayer, null);
    } else if (props.game.whosTurn.id == currentPlayer.id) {
      setPlayerToView(selectedPlayer);
      setIsViewingOtherPlayer(true);
    } else {
      props.viewStable(currentPlayer, selectedPlayer);
    }
  }

  function viewStableModal(selectedPlayer) {
    props.viewStable(currentPlayer, selectedPlayer);
    setPlayerToView(null);
    setIsViewingOtherPlayer(false);
  }
  function close() {
    setPlayerToView(null);
    setIsViewingOtherPlayer(false);
  }

  let stablePlayer = props.players.find(player => player.id == currentPlayer.viewingStableId);
  if (props.game.playing) {
    return (
      <div style={{display: !props.game.playing ? 'none' : 'block'}}>
          <PlayersView viewPlayer={viewPlayer} players={props.players}/>
          <Field player={currentPlayer}></Field>
          <ViewOtherPlayer isOpen={isViewingOtherPlayer}
              playerToView={playerToView} 
              viewStableModal={viewStableModal}
              close={close} />
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
    viewStable: bindActionCreators(viewStable, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
