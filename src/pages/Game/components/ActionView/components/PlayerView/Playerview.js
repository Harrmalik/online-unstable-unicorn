import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard, discardingCard, returningCard } from 'actions';
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

  // Effect Phase variables
  const [effects, setEffects] = useState([]);
  const [numberOfEffectsTotal, setNumberOfEffectsTotal] = useState(null);
  const [numberOfEffectsHandled, setNumberOfEffectsHandled] = useState(0);
  const [allowSkip, setAllowSkip] = useState(true);

  // Number of turns in phases
  // const [numberOfEffectsLeft, setNumberOfEffectsLeft] = useState(null);
  const [numberOfDrawsLeft, setNumberOfDrawsLeft] = useState(1);
  const [numberOfActionsLeft, setNumberOfActionsLeft] = useState(1);
  const [numberOfEndingEffectsLeft, setNumberOfEndingEffectsLeft] = useState(0);

  // Handling Intent variables
  const [numPlayersCheckedForInstants, setNumPlayersCheckedForInstants] = useState(0);
  const [opponentInteractions, setOpponentInteractions] = useState({
    numPlayersCheckedForInstants: 0,
    discardCard: false,
    checkForInstant: false,
    instant: null
  });
  const [checkForInstant, setCheckForInstant] = useState(false);


  // upgrade variables
  const [sacrificeAndDestroy, setSacrificeAndDestroy] = useState(false);
  //const [doubleActions, setDoubleActions] = useState(false);
  const [drawFromOpponent, setDrawFromOpponent] = useState(false);
  const [borrowUnicorn, setBorrowUnicorn] = useState(false);

  // downgrade variables
  const [skipDrawPhase, setSkipDrawPhase] = useState(false);
  const [skipActionPhase, setSkipActionPhase] = useState(false);

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
        if (numberOfActionsLeft === 1) {
          socketServer.emit('actionHappened', game.uri, updatedDecks, updatedPlayers);
        }
        setNumberOfActionsLeft(numberOfActionsLeft - 1)
      }
    } else if (opponentInteractions.numPlayersCheckedForInstants === players.length - 1) {
      console.log('playing card and ending turn');
      const [updatedDecks, updatedPlayers] = addToStable();
      if (numberOfActionsLeft === 1) {
        socketServer.emit('actionHappened', game.uri, updatedDecks, updatedPlayers);
      }
      setNumberOfActionsLeft(numberOfActionsLeft - 1)
    }
  }, [numPlayersCheckedForInstants])

  useEffect(() => {
    if (game.phase === 0 && myPlayer.id) {
      console.log('STARTING EFFECT PHASE')
      const cardTypes = groupBy(myPlayer.stable, 'activateAtBeginning');
      if (cardTypes['true']) {
        let theEffects = [];
        setNumberOfEffectsTotal(cardTypes['true'].length);

        cardTypes['true'].forEach(card => {
          console.log(card.name)
          if (card.hasOwnProperty('upgrade')) {
            console.log(game.upgrades[card.upgrade])
            switch (card.upgrade) {
              case 0:
                // skip either your draw or action phase
                //TODO add when adding destroy
                theEffects.push({
                  name: 'sacrifice and destory',
                  requiresAction: true,
                  callback: () => dispatch(returningCard({
                    isTrue: true,
                    //callback: () => handleEffects(null, false) TODO: make callback
                  }))
                });
                break;
              case 1:
                // Play 2 actions
                theEffects.push({
                  name: 'Gain Additional Action',
                  callback: () => setNumberOfActionsLeft(numberOfActionsLeft + 1)
                });
                break;
              case 2:
                // You may choose any other player. Pull a card from that player\'s hand and add it to your hand. If you do, skip your Draw phase.
                theEffects.push({
                  name: 'Draw from Opponent',
                  requiresAction: true,
                  callback: () => setDrawFromOpponent(true)
                });
                break;
              case 3:
                // borrowUnicorn
                theEffects.push({
                  name: 'Borrow Unicorn',
                  requiresAction: true,
                  callback: () => setBorrowUnicorn(true)
                });
                break;
              case 4:
                // drawExtraCard
                theEffects.push({
                  name: 'Draw Additional Card',
                  callback: () => setNumberOfDrawsLeft(numberOfDrawsLeft + 1)
                });
                break;
              case 5:
                // swapUnicorns
                break;
              case 6:
                // basicBitch
                break;
              case 9:
                // drawBeforeEnding
                break;
              case 10:
                // sacrificeBaby
                break;
              case 11:
                // getBabyUnicornInStable
                break;
              case 15:
                // sacrificeHand
                break;
              case 17:
                // holdMyUnicorn
                break;
              case 19:
                // drawBeforeEnding
                break;
              case 20:
                // stealUnicorn
                break;
              case 28:
                // drawThenDiscard
                break;
            }
          }

          if (card.hasOwnProperty('downgrade')) {
            switch (card.downgrade) {
              case 0:
                // skip either your draw or action phase
                setAllowSkip(false);
                theEffects.push({
                  name: 'Skip Draw Phase',
                  requiresAction: false,
                  callback: () => setSkipDrawPhase(true)
                });
                theEffects.push({
                  name: 'Skip Action Phase',
                  requiresAction: false,
                  callback: () => setSkipActionPhase(true)
                });
                break;
              case 3:
                // discard a card
                setAllowSkip(false);
                theEffects.push({
                  name: 'Discard card',
                  requiresAction: true,
                  callback: () => dispatch(discardingCard({
                    isTrue: true,
                    callback: () => handleEffects(null, false)
                  }))
                });
                break;
              case 4:
                // return a unicorn to hand
                // TODO: discard debuff when stable reaches 0 <----- v2
                setAllowSkip(false);
                theEffects.push({
                  name: 'Return unicorn',
                  requiresAction: true,
                  callback: () => dispatch(returningCard({
                    isTrue: true,
                    callback: () => handleEffects(null, false)
                  }))
                });
                break;
            }
          }
        })

        setEffects(theEffects);
        setNumberOfEffectsHandled(0);
      } else {
          setNumberOfEffectsTotal(0);
          setNumberOfEffectsHandled(0);
      }
    }

    if (game.phase === 1) {
      if (skipDrawPhase) {
        console.log('skipping')
        dispatch(nextPhase(2))
      }
    }

    if (game.phase === 2) {
      if (skipActionPhase) {
        dispatch(nextPhase(3))
      }
    }

    if (game.phase === 3 && !isDiscardingCard.isTrue) {
      console.log('STARTING END TURN PHASE')
      if (myPlayer.hand.length > 7) {
        setNumberOfEndingEffectsLeft(numberOfEndingEffectsLeft - 1);
        dispatch(discardingCard({
          isTrue: true,
          callback: null
        }));
      } else {
        setNumberOfEndingEffectsLeft(numberOfEndingEffectsLeft - 1);
      }
    }
  }, [game.phase, isDiscardingCard, myPlayer.stable])


  // Effects for Effects =)
  useEffect(() => {
    if (drawFromOpponent) {
      console.log('Handle draw from opponent');
      // Select Opponent
      // Take card
      setSkipDrawPhase(true);
      setNumberOfEffectsHandled(numberOfEffectsHandled + 1);
    }
  }, [drawFromOpponent])

  useEffect(() => {
    if (borrowUnicorn) {
      console.log('Handle borrow unicorn');
      // Select unicorn from opponent stable
      setNumberOfEffectsHandled(numberOfEffectsHandled + 1);
    }
  }, [borrowUnicorn])



  // Effects for phases
  useEffect(() => {
    if (typeof numberOfEffectsTotal === 'number' && numberOfEffectsTotal === numberOfEffectsHandled) {
      console.log('ending pre effects phase')
      dispatch(nextPhase(1))
      socketServer.emit('endEffectPhase', lobbyName, 1);
    }
  }, [numberOfEffectsTotal, numberOfEffectsHandled])

  useEffect(() => {
    if (numberOfDrawsLeft === 0) {
      console.log('ending draw phase')
      dispatch(nextPhase(2));
    }
  }, [numberOfDrawsLeft])

  useEffect(() => {
    if (numberOfActionsLeft === 0) {
      console.log('ending action phase');
      if (myPlayer.hand.length > 7) {
        setNumberOfEndingEffectsLeft(numberOfEndingEffectsLeft + (myPlayer.hand.length - 7))
      }
      socketServer.emit('endActionPhase', lobbyName);
    }
  }, [numberOfActionsLeft])

  useEffect(() => {
    if (game.phase === 3 && numberOfEndingEffectsLeft === 0) {
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
  }, [numberOfEndingEffectsLeft, game.phase])



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

  function handleEffects(effectCallback, requiresAction) {
    if (effectCallback) {
      effectCallback();
    }

    if (!requiresAction) {
      setNumberOfEffectsHandled(numberOfEffectsHandled + 1);
    }
  }

  function drawCard(phase) {
    let updatedDecks = decks;
    let player = myPlayer;
    let allPlayers = players;


    const nextCards = updatedDecks.drawPile.splice(0, 1);
    player.hand = [...player.hand, ...nextCards];
    allPlayers[player.currentPlayerIndex] = player;

    socketServer.emit('drawCard', lobbyName, updatedDecks, allPlayers, phase === 3 ? 2 : phase)
    if (phase === 3) {
      setNumberOfActionsLeft(numberOfActionsLeft - 1);
    } else {
      setNumberOfDrawsLeft(numberOfDrawsLeft - 1);
    }
  }

  function playCard() {
    dispatch(playingCard({isTrue: true, callback: null}))
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

  function handleActions(action, callback) {
    switch (action) {
      case 'drawCard':
        drawCard(3);
        break;
      case 'playCard':
        playCard();
        break;
      default:
        callback()
    }
  }

  function renderView() {
    switch (game.phases[game.phase].name) {
      case 'Pre Effects':
        return <EffectsView
                  effects={effects}
                  handleEffects={handleEffects}
                  allowSkip={allowSkip}
                  skipPhase={() => setNumberOfEffectsHandled(numberOfEffectsHandled + 1)}/>
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
                  handleActions={handleActions}
                  checkForInstant={checkForInstant}
                  handleInstant={handleInstant}/>
        break;
      case 'Post Effects':
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
  const { handleEffects, allowSkip, skipPhase, effects } = props;
  return (
    <div>
      {
        effects.map((effect, index) => {
          return <Button key={index} onClick={() => { handleEffects(effect.callback, effect.requiresAction) }}>{effect.name}</Button>
        })
      }
      { allowSkip ? <Button onClick={skipPhase}>Skip</Button> : null }
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
  const { handleActions, checkForInstant, handleInstant } = props;
  const instantActions = useCheckForInstants
  console.log('Should be showing instants: ', checkForInstant)

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
      <Button onClick={() => { handleActions('drawCard') }}>Draw Card</Button>
      <Button onClick={() => { handleActions('playCard') }}>Play Card</Button>

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
