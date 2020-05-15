import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { playingCard, attemptToPlay } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import { Card, Header } from 'semantic-ui-react';
import './HandComponent.css';

import CardComponent from 'components/Card/CardComponent';

function HandComponent() {
  const myPlayer = useMyPlayer();
  const isMyTurn = useSelector(state => state.isMyTurn);
  const isPlayingCard = useSelector(state => state.isPlayingCard);
  // const players = useSelector(state => state.players);
  const socketServer = useSelector(state => state.socket);
  const lobbyName = useSelector(state => state.game.uri);
  const dispatch = useDispatch()

  function playCard(card, index) {
    if (isMyTurn && isPlayingCard) {
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
        case 'Instant':
          console.log('PLAYING EFFECT')
          break;
        default:

      }
    }
  }

  return (
    <div className="hand">
      { isPlayingCard ? <Header>Choose Card to Play</Header> : null }
      <Card.Group>
        {myPlayer.hand.map((card, index) => {
          return <CardComponent
            index={index}
            key={card.id}
            card={card}
            isPlayingCard={isPlayingCard}
            callback={playCard}/>
        })}
      </Card.Group>
    </div>
  );
}

export default HandComponent
