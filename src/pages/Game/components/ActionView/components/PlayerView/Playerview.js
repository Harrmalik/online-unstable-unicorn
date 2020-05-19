import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard, discardingCard } from 'actions';
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
  const isDiscardingCard = useSelector(state =>  state.isDiscardingCard);
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
  const [readyToEndTurn, setReadyToEndTurn] = useState(false);

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

  useEffect(() => {
    if (game.phase === 0 && myPlayer.id) {
      console.log('STARTING EFFECT PHASE')
      let player = myPlayer;
      let stable = player.stable
      const cardTypes = groupBy(stable, 'activateAtBeginning');
      if (cardTypes['true']) {
        setEffects(cardTypes['true'].map(card => {
          //TODO: added in upgrades, downgrades
          return {
            ...card,
            callback: () => handleEffects(card)
          }
        }))
      } else {
          dispatch(nextPhase(1))
          socketServer.emit('endEffectPhase', lobbyName, 1);
      }
    }

    if (game.phase === 1) {

    }

    if (game.phase === 2) {

    }

    if (game.phase === 3 && !isDiscardingCard) {
      console.log('STARTING END TURN PHASE')
      if (myPlayer.hand.length > 7) {
        dispatch(discardingCard(true));
      } else {
        setReadyToEndTurn(true);
      }
    }
  }, [game.phase, isDiscardingCard, myPlayer.stable])

  useEffect(() => {
    if (readyToEndTurn) {
      let nextTurn = game.turn + 1;
      let nextPlayerIndex = nextTurn % players.length;
      let whosTurn = players[nextPlayerIndex];

      const gameUpdates = {
        turn: nextTurn,
        whosTurn,
        phase: 0
      }

      dispatch(endTurn(gameUpdates, nextPlayerIndex === myPlayer.currentPlayerIndex));
      socketServer.emit('endTurn', lobbyName, gameUpdates, nextPlayerIndex);
    }
  }, [readyToEndTurn])

  function addToStable() {
    const updatedPlayers = players;
    const updatedDecks = decks;
    const cardIndex = myPlayer.hand.findIndex(card => card.id === cardBeingPlayed.id);

    updatedPlayers[myPlayer.currentPlayerIndex].hand.splice(cardIndex,1);
    updatedPlayers[myPlayer.currentPlayerIndex].stable.push(cardBeingPlayed);

    return [updatedDecks, updatedPlayers];
  }

  function addToDiscardPile(shouldAlsoDiscardFromHand) {
    const updatedPlayers = players;
    const updatedDecks = decks;
    const opponentIndex = opponentInteractions.instant.playerIndex;
    const currentInstant = opponentInteractions.instant;
    const cardIndex = myPlayer.hand.findIndex(card => card.id === cardBeingPlayed.id);
    const instantIndex = updatedPlayers[opponentIndex].hand.findIndex(instant => instant.id === currentInstant.id);

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

  function handleEffects(effect) {
    console.log(game.upgrades)
    console.log(game.upgrades[effect.upgrade])
  }

  function drawCard(phase) {
    let updatedDecks = decks;
    let player = myPlayer;
    let allPlayers = players;


    const nextCards = updatedDecks.drawPile.splice(0, 1);
    player.hand = [...player.hand, ...nextCards];
    allPlayers[player.currentPlayerIndex] = player;

    socketServer.emit('drawCard', lobbyName, updatedDecks, allPlayers, phase)
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
      //TODO: adding ability to instant an instant
      // socketServer.emit('endActionPhase', game.uri, 3, updatedDecks, updatedPlayers);
    }
  }

  function renderView() {
    switch (game.phases[game.phase].name) {
      case 'Effect':
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
        return <EndView />
        break;
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
  const { skipPhase, effects } = props;
  return (
    <div>
      {
        effects.map(effect => {
          return <Button key={effect.id} onClick={() => { effect.callback() }}>{effect.name}</Button>
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
