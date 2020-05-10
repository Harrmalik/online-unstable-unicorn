import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard } from 'actions';
import { Dropdown, Image, Item, Segment, Button } from 'semantic-ui-react';
import groupBy from 'lodash/groupBy';


function PlayerView(props) {
  const [phase, setPhase] = useState(props.game.phase);
  const [startedEffectPhase, setStartedEffectPhase] = useState(false)
  const [startedEndPhase, setStartedEndPhase] = useState(false)
  const [effects, setEffects] = useState([])
  const [numPlayersCheckedForInstants, setNumPlayersCheckedForInstants] = useState(0)
  console.log(props)

  useEffect(() => {
    // console.log('calling use effect for player view')
    props.socket.on('playerCheckedForInstant', player => {
      // console.log('hey man from ', player.name)
      setNumPlayersCheckedForInstants(numPlayersCheckedForInstants + 1)
    })
  })

  function checkForEffects() {
    console.log('has started effect phase: ', startedEffectPhase)
    if (!startedEffectPhase) {
      let player = props.players[props.currentPlayer -1];
      let stable = player.stable
      const cardTypes = groupBy(stable, 'activateAtBeginning');
      setStartedEffectPhase(true)
      setStartedEndPhase(false)
      if (cardTypes['true']) {
        setEffects(cardTypes['true'].map(card => {
          //TODO: added in upgrades, downgrades
          return {
            ...card
          }
        }))
      } else {
          props.nextPhase(1)
          props.socket.emit('endEffectPhase', 1);
          setStartedEffectPhase(true)
          setStartedEndPhase(false)
      }
    }
  }

  function skipPhase() {
    props.nextPhase(1)
    props.socket.emit('endEffectPhase', 1);
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
        let nextPlayerID = nextTurn % props.players.length;
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

        return <EffectsView
                  effects={effects}
                  skipPhase={skipPhase}/>
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
  console.log('WE GO SOMETHING????? ', props)
  return (
    <div>
      {props.effects.map(effect => {
        return <Button onClick={() => { props.skipPhase(2) }}>{effect.name}</Button>
      })}
      <Button onClick={() => { props.skipPhase(2) }}>Skip</Button>
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

const mapDispatchToProps = (dispatch, ownProps) => ({
    setCurrentPlayer: bindActionCreators(setCurrentPlayer, dispatch),
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
    nextPhase: bindActionCreators(nextPhase, dispatch),
    playingCard: bindActionCreators(playingCard, dispatch),
    endTurn: bindActionCreators(endTurn, dispatch),
    ownProps
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerView)
