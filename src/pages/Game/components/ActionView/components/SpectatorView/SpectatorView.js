import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard } from 'actions';
import { Dropdown, Image, Item, Segment, Button } from 'semantic-ui-react';
import groupBy from 'lodash/groupBy';
import { useMyPlayer, useCheckForInstants } from 'utils/hooks.js';

// Components
import CardComponent from 'components/Card/CardComponent';

const MemoSpectatorView = React.memo(() => {
  const myPlayer = useMyPlayer();
  const [card, setCard] = useState(null);
  const socketServer = useSelector(state => state.socket);
  const currentGame = useSelector(state => state.game);
  const decks = useSelector(state => state.decks);
  const dispatch = useDispatch();
  const [checkForInstant, setCheckForInstant] = useState(false);

  useEffect(() => {
    socketServer.on('switchingPhase', phase => {
      dispatch(nextPhase(phase))
    })

    socketServer.on('attemptCardPlay', (card, updatedPlayers) => {
      setCard(card);
      setCheckForInstant(true);
    })

    socketServer.on('endingTurn', (gameUpdates, nextPlayerIndex) => {
      dispatch(endTurn(gameUpdates, nextPlayerIndex === parseInt(localStorage.getItem('currentPlayerIndex'))))
    })

    return () => {
      socketServer.removeListener('switchingPhase')
      socketServer.removeListener('attemptCardPlay')
      socketServer.removeListener('endingTurn')
    }
  }, [socketServer])

  function handleInstant(instant) {
    if (instant.name === 'Skip') {
      socketServer.emit('skippingInstant', currentGame.uri, myPlayer.currentPlayerIndex, card)
    } else {
      socketServer.emit('playInstant', currentGame.uri, myPlayer.currentPlayerIndex, instant)
    }
    setCheckForInstant(false);
  }

  return (
    <div>
      {currentGame.whosTurn.name} Turn

      {
        card ?
        <MemoCounterActionView
          card={card}
          checkForInstant={checkForInstant}
          handleInstant={handleInstant}/>
          : null
        }
    </div>
  )
})


const MemoCounterActionView = React.memo((props) => {
  const { card, checkForInstant, handleInstant } = props;
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
      { renderInstants() }
      <CardComponent card={card}/>
    </div>
  )
})

export default MemoSpectatorView
