import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import groupBy from 'lodash/groupBy';
import { Dropdown, Image, Item, Segment, Button } from 'semantic-ui-react';


function PlayerView() {
  const myPlayer = useMyPlayer();
  const socketServer = useSelector(state => state.socket)
  const lobbyName = useSelector(state =>  state.game.uri);
  const isMyTurn = useSelector(state =>  state.isMyTurn);
  const players = useSelector(state =>  state.players);
  const game = useSelector(state =>  state.game);
  const decks = useSelector(state =>  state.decks);
  const cardBeingPlayed = useSelector(state =>  state.cardBeingPlayed);
  const dispatch = useDispatch();

  const [effects, setEffects] = useState([])
  const [numPlayersCheckedForInstants, setNumPlayersCheckedForInstants] = useState(0);

  useEffect(() => {
    socketServer.on('playerCheckedForInstant', playerIndex => {
      console.log('hey man from ', players[playerIndex].name);
      setNumPlayersCheckedForInstants(numPlayersCheckedForInstants + 1);
    })

    return () => {
      socketServer.removeListener('playerCheckedForInstant');
    }
  },[socketServer])

  useEffect(() => {
    if (numPlayersCheckedForInstants === players.length - 1) {
      console.log('ready to play card');
      //TODO: do some effects to users;
      const cardIndex = myPlayer.hand.findIndex(card => {
        return card.id === cardBeingPlayed.id
      });
      let updatedPlayers = players;
      let updatedDecks = decks;

      updatedPlayers[myPlayer.currentPlayerIndex].hand.splice(cardIndex,1);
      updatedPlayers[myPlayer.currentPlayerIndex].stable.push(cardBeingPlayed);
      socketServer.emit('endActionPhase', game .uri, 3, updatedDecks, updatedPlayers)
    }

    console.log(numPlayersCheckedForInstants)
  }, [numPlayersCheckedForInstants])

  function checkForEffects() {
    console.log('STARTING EFFECT PHASE')
    let player = myPlayer;
    let stable = player.stable
    const cardTypes = groupBy(stable, 'activateAtBeginning');
    if (cardTypes['true']) {
      setEffects(cardTypes['true'].map(card => {
        //TODO: added in upgrades, downgrades
        return {
          ...card
        }
      }))
    } else {
        dispatch(nextPhase(1))
        socketServer.emit('endEffectPhase', lobbyName, 1);
    }
  }

  function skipPhase() {
    dispatch(nextPhase(1))
    socketServer.emit('endEffectPhase', lobbyName, 1);
  }

  function drawCard(phase) {
    console.log('drawing card')
    let drawPile = decks.drawPile;
    let player = myPlayer;
    let allPlayers = players;

    const nextCards = drawPile.splice(0, 1);
    player.hand = [...player.hand, ...nextCards];
    allPlayers[player.currentPlayerIndex] = player;

    socketServer.emit('drawCard', lobbyName, drawPile, allPlayers, phase)
    dispatch(nextPhase(phase))
  }

  function playCard() {
    dispatch(playingCard(true))
  }

  function handleEndTurn() {
    console.log('STARTING END TURN PHASE')
    setTimeout(() => {
      let nextTurn = game.turn + 1;
      let nextPlayerIndex = nextTurn % players.length;
      let whosTurn = players[nextPlayerIndex];

      const gameUpdates = {
        turn: nextTurn,
        whosTurn,
        phase: 0
      }

      dispatch(endTurn(gameUpdates, nextPlayerIndex === parseInt(localStorage.getItem('currentPlayerIndex'))))
      socketServer.emit('endTurn', lobbyName, gameUpdates, nextPlayerIndex);
    }, 3000)
  }

  function endGame() {
    dispatch(endGame())
    socketServer.emit('endGame', lobbyName);
  }

  function renderView() {
    switch (game.phases[game.phase].name) {
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
        handleEndTurn()
        return <EndView />
        break;
      default:
        return <p>Game Over</p>
    }
  }

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

export default PlayerView
