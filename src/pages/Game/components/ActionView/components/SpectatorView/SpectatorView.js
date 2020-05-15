import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPlayer, setPlayers, startGame, nextPhase, endTurn, playingCard } from 'actions';
import { Dropdown, Image, Item, Segment, Button } from 'semantic-ui-react';
import groupBy from 'lodash/groupBy';
import { useMyPlayer } from 'utils/hooks.js';

// Components
import CardComponent from 'components/Card/CardComponent';

const MemoSpectatorView = React.memo(SpectatorView);

function SpectatorView() {
  const [card, setCard] = useState({});
  const socketServer = useSelector(state => state.socket);
  const currentGame = useSelector(state => state.game);
  const decks = useSelector(state => state.decks);
  const dispatch = useDispatch();

  useEffect(() => {
    socketServer.on('switchingPhase', phase => {
      console.log('CALLING NEW PHASE');
      dispatch(nextPhase(phase))
    })

    socketServer.on('attemptCardPlay', (card, updatedPlayers) => {
      console.log('Player attemping to play card');
      // let myPlayer = updatedPlayers[props.currentPlayer - 1]
      // //TODO: show screen of card being played and if a instant can be activated
      // let handGroupedByType = GroupBy(myPlayer.hand, 'type');
      //
      // console.log(handGroupedByType);
      // if (handGroupedByType['Instant']) {
      //   setTimeout(() => {
      //     socketServer.emit('skippingInstant', myPlayer);
      //   }, 5000)
      // } else {
      //   //TODO: Add player count to check if everyone skipped their instants
      //   socketServer.emit('skippingInstant', myPlayer);
      // }
      // setCard(card);

      // UNCOMMENT THIS IF YOU WANNA SKIP THE CHECK
      setTimeout(() => {
        //TODO: for now wait 3 secs then play card, maybe add a timer?
        const updatedDecks = decks;
        socketServer.emit('endActionPhase', 3, updatedDecks, updatedPlayers)
      })
    })

    socketServer.on('endingTurn', (gameUpdates, nextPlayerIndex) => {
      console.log('CALLING END TURN')

      if (currentGame.phase === 0) {
        dispatch(endTurn(gameUpdates, nextPlayerIndex === parseInt(localStorage.getItem('currentPlayerIndex'))))
      }
    })

    return () => {
      socketServer.removeListener('switchingPhase')
      socketServer.removeListener('attemptCardPlay')
      socketServer.removeListener('endingTurn')
    }
  }, [socketServer])

  return (
    <div>
      {currentGame.whosTurn.name} Turn

      <CardComponent card={card}/>
    </div>
  )
}

export default MemoSpectatorView
