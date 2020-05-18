import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { playingCard, attemptToPlay, discardCard, discardingCard } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import { Card, Header } from 'semantic-ui-react';
import './HandComponent.css';

import CardComponent from 'components/Card/CardComponent';

function HandComponent() {
  const myPlayer = useMyPlayer();
  const isMyTurn = useSelector(state => state.isMyTurn);
  const isPlayingCard = useSelector(state => state.isPlayingCard);
  const isDiscardingCard = useSelector(state => state.isDiscardingCard);
  const socketServer = useSelector(state => state.socket);
  const lobbyName = useSelector(state => state.game.uri);
  const dispatch = useDispatch();

  // Move to player view???
  const players = useSelector(state => state.players);
  const decks = useSelector(state => state.decks);

  function handleOnClick(card, index) {
    if (isPlayingCard) {
      handlePlayCard(card, index);
    }

    if (isDiscardingCard) {
      handleDiscardCard(card, index);
    }
  }

  function handlePlayCard(card, index) {
    switch (card.type) {
      case 'Baby Unicorn':
      case 'Basic Unicorn':
      case 'Magical Unicorn':
      case 'Upgrade':
      case 'Downgrade':
        dispatch(playingCard(false))
        dispatch(attemptToPlay(card))
        socketServer.emit('attemptToPlayCard', lobbyName, card)
        break;

      case 'Magic':
        console.log('PLAYING EFFECT')
        break;
      default:

    }
  }

  function handleDiscardCard(card, index) {
    const updatedDecks = decks;
    const updatedPlayers = players;
    const cardIndex = myPlayer.hand.findIndex(cardFromHand => cardFromHand.id === card.id);

    updatedDecks['discardPile'].push(card);
    updatedPlayers[myPlayer.currentPlayerIndex].hand.splice(cardIndex,1);
    socketServer.emit('discardCard', lobbyName, card, updatedDecks, updatedPlayers);
    dispatch(discardingCard(false));
  }

  return (
    <div className="hand">
      { isPlayingCard ? <Header>Choose Card to Play</Header> : null }
      { isDiscardingCard ? <Header>Choose Card to Discard</Header> : null }
      <Card.Group>
        {myPlayer.hand.map((card, index) => {
          return <CardComponent
            index={index}
            key={card.id}
            card={card}
            callback={handleOnClick}/>
        })}
      </Card.Group>
    </div>
  );
}

export default HandComponent
