import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard } from 'actions';
import { useMyPlayer, useCheckForInstants } from 'utils/hooks.js';
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
  const [opponentInteractions, setOpponentInteractions] = useState({
    numPlayersCheckedForInstants: 0,
    discardCard: false,
    checkForInstant: false,
    instant: null
  });
  const [checkForInstant, setCheckForInstant] = useState(false);

  useEffect(() => {
    socketServer.on('playerCheckedForInstant', (playerIndex, instant) => {
      let interactions = opponentInteractions;
      if (instant) {
        console.log(`${players[playerIndex].name} played ${instant.name}`)
        interactions.instant = {
          ...instant,
          playerIndex
        }
        switch (instant.name) {
          case 'NEIGH MEANS NEIGH':
            interactions.checkForInstant = false;
            break;

          case 'NEIGH, MOTHERFUCKER':
            interactions.discardCard = true;
            interactions.checkForInstant = true;
            break;
          default:
            interactions.checkForInstant = true;
        }
      }

      interactions.numPlayersCheckedForInstants++
      setOpponentInteractions(interactions);
      setNumPlayersCheckedForInstants(interactions.numPlayersCheckedForInstants)
    })

    return () => {
      socketServer.removeListener('playerCheckedForInstant');
    }
  },[socketServer])

  useEffect(() => {
    console.log('opponentInteractions updated')
    console.log(opponentInteractions, players.length)
    console.log(numPlayersCheckedForInstants)
    if (opponentInteractions.instant) {
      if (opponentInteractions.checkForInstant) {
        console.log('checking for instant before ending turn');
        setCheckForInstant(true);
      } else {
        console.log('discarding card and ending turn');
        const [updatedDecks, updatedPlayers] = addToDiscardPile();
        socketServer.emit('endActionPhase', game.uri, 3, updatedDecks, updatedPlayers);
      }
    } else if (opponentInteractions.numPlayersCheckedForInstants === players.length - 1) {
      console.log('playing card and ending turn');
      const [updatedDecks, updatedPlayers] = addToStable();
      socketServer.emit('endActionPhase', game.uri, 3, updatedDecks, updatedPlayers)
    }
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

  function addToStable() {
    const updatedPlayers = players;
    const updatedDecks = decks;
    const cardIndex = myPlayer.hand.findIndex(card => {
      return card.id === cardBeingPlayed.id
    });

    updatedPlayers[myPlayer.currentPlayerIndex].hand.splice(cardIndex,1);
    updatedPlayers[myPlayer.currentPlayerIndex].stable.push(cardBeingPlayed);

    return [updatedDecks, updatedPlayers];
  }

  function addToDiscardPile(shouldAlsoDiscardFromHand) {
    const updatedPlayers = players;
    const updatedDecks = decks;
    const opponentIndex = opponentInteractions.instant.playerIndex;
    const currentInstant = opponentInteractions.instant;
    const cardIndex = myPlayer.hand.findIndex(card => {
      return card.id === cardBeingPlayed.id
    });
    const instantIndex = updatedPlayers[opponentIndex].hand.findIndex(instant => {
      return instant.id === currentInstant.id
    });
    
    updatedDecks['discardPile'].push(cardBeingPlayed);
    updatedDecks['discardPile'].push(updatedPlayers[opponentIndex].instantIndex);
    updatedPlayers[myPlayer.currentPlayerIndex].hand.splice(cardIndex,1);
    updatedPlayers[opponentIndex].hand.splice(instantIndex,1);
    return [updatedDecks, updatedPlayers];
  }

  function skipPhase() {
    dispatch(nextPhase(1))
    socketServer.emit('endEffectPhase', lobbyName, 1);
  }

  function drawCard(phase) {
    let drawPile = decks.drawPile;
    let player = myPlayer;
    let allPlayers = players;

    const nextCards = drawPile.splice(0, 1);
    player.hand = [...player.hand, ...nextCards];
    allPlayers[player.currentPlayerIndex] = player;

    socketServer.emit('drawCard', lobbyName, drawPile, allPlayers, phase)
    console.log(phase)
    dispatch(nextPhase(phase))
  }

  function playCard() {
    dispatch(playingCard(true))
  }

  function handleInstant(instant) {
    if (instant.name === 'Skip') {
      console.log('called skip intent')
      const [updatedDecks, updatedPlayers] = addToDiscardPile();
      socketServer.emit('endActionPhase', game.uri, 3, updatedDecks, updatedPlayers);
    } else {
      console.log('called play intent from player hand', instant)
      // socketServer.emit('playInstant', currentGame.uri, myPlayer.currentPlayerIndex, instant)
    }
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
                  playCard={playCard}
                  checkForInstant={checkForInstant}
                  handleInstant={handleInstant}/>
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
  const { skipPhase, effects } = props;
  return (
    <div>
      {
        effects.map(effect => {
          return <Button onClick={() => { skipPhase(2) }}>{effect.name}</Button>
        })
      }
      <Button onClick={() => { skipPhase(2) }}>Skip</Button>
    </div>
  )
}

function DrawView(props) {
  const { drawCard } = props;
  return (
    <div>
      <Button onClick={() => { drawCard(2) }}>Draw Card</Button>
    </div>
  )
}

// TODO: make shared component with spectatorview
function ActionView(props) {
  const { drawCard, playCard, checkForInstant, handleInstant } = props;
  const instantActions = useCheckForInstants();

  function renderInstants() {
    if (checkForInstant) {
      return (
        <div>
          { instantActions.map(action => {
            return (
              <Button key={action.id}
                content={action.name}
                onClick={() => handleInstant(action) }
              />
            )
          })}
        </div>
      )
    }
  }

  return (
    <div>
      <Button onClick={() => { drawCard(3) }}>Draw Card</Button>
      <Button onClick={ playCard }>Play Card</Button>

      { renderInstants() }
    </div>
  )
}

function EndView(props) {
  const {} = props;
  return (
    <div>
      Ending turn
    </div>
  )
}

export default PlayerView
