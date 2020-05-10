import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard } from 'actions';
import { Dropdown, Image, Item, Segment, Button } from 'semantic-ui-react';


function PlayerView(props) {
  const [phase, setPhase] = useState(props.game.phase);
  const [startedEffectPhase, setStartedEffectPhase] = useState(false)
  const [startedEndPhase, setStartedEndPhase] = useState(false)
  function checkForEffects() {
    console.log('has started effect phase: ', startedEffectPhase)
    if (!startedEffectPhase) {
      console.log('emitint next turn')
      setStartedEffectPhase(true)
      setTimeout(() => {
        props.nextPhase(1)
        props.socket.emit('endEffectPhase', 1);
        setStartedEndPhase(false)
        // setPhase(phase + 1)
      }, 3000)
    }
  }

  function drawCard(phase) {
    let drawPile = props.decks.drawPile;
    let player = props.players[props.currentPlayer -1];
    let players = props.players;

    const nextCards = drawPile.splice(0, 1);
    player.hand = [...player.hand, ...nextCards];
    players[props.currentPlayer - 1] = player

    props.socket.emit('drawCard', drawPile, players, phase)
    props.nextPhase(phase)
  }

  function playCard() {
    props.playingCard(true)
    // props.socket.emit('playCard', 3);
  }

  function endTurn() {
    console.log('has started effect phase: ', startedEndPhase)
    if (!startedEndPhase) {
      setStartedEndPhase(true)
      setTimeout(() => {
        let nextTurn = props.game.turn + 1;
        let nextPlayerID = (nextTurn % props.players.length) == 0 ? props.players.length : (nextTurn % props.players.length);
        let whosTurn = props.players[nextPlayerID -1];

        const gameUpdates = {
          turn: nextTurn,
          whosTurn,
          phase: 0
        }

        props.endTurn(gameUpdates, props.currentPlayer)
        props.socket.emit('endTurn', gameUpdates);
        setStartedEffectPhase(false)
      }, 3000)
    }
  }

  function endGame() {
    props.endGame()
    props.socket.emit('endGame');
  }

  function renderView() {
    switch (props.game.phases[props.game.phase].name) {
      case 'Effect':
        checkForEffects()
        return <EffectsView/>
        break;
      case 'Draw':
        return (
          <DrawView
            drawCard={drawCard}
          />
        )
        break;
      case 'Action':
        return <ActionView
                  drawCard={drawCard}
                  playCard={playCard}/>
        break;
      case 'EndTurn':
        endTurn()
        return <EndView />
        break;
      default:
        return <p>Game Over</p>
    }
  }


  console.log('rendered')
  return (
    <div>
      My Turn
      {renderView()}
    </div>
  )
}

function EffectsView(props) {
  return (
    <div>
      No Effects Found
    </div>
  )
}

function DrawView(props) {
  return (
    <div>
      <Button onClick={() => { props.drawCard(2) }}>Draw Card</Button>
    </div>
  )
}

function ActionView(props) {
  return (
    <div>
      <Button onClick={() => { props.drawCard(3) }}>Draw Card</Button>
      <Button onClick={props.playCard}>Play Card</Button>
    </div>
  )
}

function EndView(props) {
  return (
    <div>
      Ending turn
    </div>
  )
}

const mapStateToProps = state => ({
  isMyTurn: state.isMyTurn,
  currentPlayer: state.currentPlayer,
  decks: state.decks,
  players: state.players,
  game: state.game,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    setCurrentPlayer: bindActionCreators(setCurrentPlayer, dispatch),
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
    nextPhase: bindActionCreators(nextPhase, dispatch),
    playingCard: bindActionCreators(playingCard, dispatch),
    endTurn: bindActionCreators(endTurn, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerView)
