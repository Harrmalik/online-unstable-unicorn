import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame } from 'actions';
import './ActionViewComponent.css';
import GroupBy from 'lodash/groupBy';
import Remove  from 'lodash/remove';
import Shuffle  from 'lodash/shuffle';
import Reduce  from 'lodash/reduce';
import { Dropdown, Image, Item, Segment } from 'semantic-ui-react';

function ActionViewComponent (props) {
  const [currentPlayer, setCurrentPlayer] = useState(localStorage.getItem('currentPlayer'));

  useEffect(() => {
    // Set current player, if they refreshed the page after creating a player
    if (!props.currentPlayer && currentPlayer) {
      props.setCurrentPlayer(currentPlayer);
    }

  }, []);

  return (
    <div>
      {props.isMyTurn ? <PlayerView/> : <SpectatorView name={props.game.whosTurn.name} />}
      {props.game.phases[props.game.phase].name} Phase
    </div>
  );
}

function SpectatorView(props) {
  return (
    <div>
      {props.name} Turn
    </div>
  )
}

function PlayerView(props) {
  return (
    <div>
      My Turn
    </div>
  )
}

const mapStateToProps = state => ({
  isMyTurn: state.isMyTurn,
  currentPlayer: state.player,
  players: state.players,
  game: state.game,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    setCurrentPlayer: bindActionCreators(setCurrentPlayer, dispatch),
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionViewComponent)
