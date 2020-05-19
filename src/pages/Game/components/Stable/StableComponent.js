import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { returningCard, endGame } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import './StableComponent.css';
import { Card, Header } from 'semantic-ui-react';

// Components
import CardComponent from 'components/Card/CardComponent';

const MemoStableComponent = React.memo(() => {
  const { currentPlayerIndex, name, stable } = useMyPlayer();
  const socketServer = useSelector(state => state.socket);
  const lobbyName = useSelector(state => state.game.uri);
  const isReturningCard = useSelector(state => state.isReturningCard)
  const dispatch = useDispatch();

  // Move to player view???
  const players = useSelector(state => state.players);
  const decks = useSelector(state => state.decks);

  useEffect(() => {
    if (stable && stable.length === 7) {
      console.log('ENDING THE GAME');
      dispatch(endGame());
    }
  }, [stable])

  function handleReturnCard(card, index) {
    const updatedDecks = decks;
    const updatedPlayers = players;

    if (card.type === 'Baby Unicorn') {
      updatedDecks['nursery'].push(card);
      updatedPlayers[currentPlayerIndex].stable.splice(index,1);
    } else {
      updatedPlayers[currentPlayerIndex].hand.push(card);
      updatedPlayers[currentPlayerIndex].stable.splice(index,1);
    }

    socketServer.emit('returnCard', lobbyName, card, updatedDecks, updatedPlayers);
    if (isReturningCard.callback) {
      isReturningCard.callback();
    }
    dispatch(returningCard({isTrue: false, callback: null}));
  }

  return (
    <div className="stable">
      <Header>{name}'s Stable</Header>
      { isReturningCard.isTrue ? <Header>Choose Card to Return</Header> : null }
      <Card.Group>
        {
          stable && stable.map((card, index) => {
            return <CardComponent index={index} key={card.id} card={card} callback={handleReturnCard}/>
          })
        }
      </Card.Group>
    </div>
  );
})

export default MemoStableComponent
