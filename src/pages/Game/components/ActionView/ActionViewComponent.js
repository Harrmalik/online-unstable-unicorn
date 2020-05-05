import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endActionPhase, endTurn } from 'actions';
import './ActionViewComponent.css';
import GroupBy from 'lodash/groupBy';
import Remove  from 'lodash/remove';
import Shuffle  from 'lodash/shuffle';
import Reduce  from 'lodash/reduce';
import { Dropdown, Image, Item, Segment } from 'semantic-ui-react';

import PlayerView from './components/PlayerView/Playerview.js'

function ActionViewComponent (props) {
  const [currentPlayer, setCurrentPlayer] = useState(localStorage.getItem('currentPlayer'));
  const [phase, setPhase] = useState();

  useEffect(() => {
    props.socket.on('endingActionPhase', (phase, updatedDecks, updatedPlayers) => {
      //TODO maybe make 2 calls based on if decks were updated
      console.log(phase, updatedDecks, updatedPlayers)
      console.log('called ending action phase');
      props.endActionPhase(phase, updatedDecks, updatedPlayers);
    })
  }, []);

  return (
    <div>
      {props.game.phases[props.game.phase].name} Phase
      {
        props.isMyTurn ?
        <PlayerView/> :
        <SpectatorView
          currentPlayer={props.currentPlayer}
          phase={props.game.phase}
          socket={props.socket}
          name={props.game.whosTurn.name}
          nextPhase={props.nextPhase}
          decks={props.decks}
          endTurn={props.endTurn} />
      }
    </div>
  );
}

function SpectatorView(props) {
  useEffect(() => {
    props.socket.on('switchingPhase', phase => {
      console.log('CALLING NEW PHASE');
      props.nextPhase(phase)
    })

    props.socket.on('attemptCardPlay', (card, updatedPlayers) => {
      console.log('Player attemping to play card');
      //TODO: show screen of card being played and if a instant can be activated

      setTimeout(() => {
        //TODO: for now wait 3 secs then play card, maybe add a timer?
        const updatedDecks = props.decks;
        props.socket.emit('endActionPhase', 3, updatedDecks, updatedPlayers)
      })
    })

    props.socket.on('endingTurn', (gameUpdates) => {
      // TODO: look into too
      if (props.phase === 3) {
        console.log('EDNING TURN');
        props.endTurn(gameUpdates, props.currentPlayer)
      }
    })
  })
  return (
    <div>
      {props.name} Turn
    </div>
  )
}

const mapStateToProps = state => ({
  isMyTurn: state.isMyTurn,
  currentPlayer: state.currentPlayer,
  players: state.players,
  game: state.game,
  decks: state.decks,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    setCurrentPlayer: bindActionCreators(setCurrentPlayer, dispatch),
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
    nextPhase: bindActionCreators(nextPhase, dispatch),
    endActionPhase: bindActionCreators(endActionPhase, dispatch),
    endTurn: bindActionCreators(endTurn, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionViewComponent)
