import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { returningCard, endGame } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import './StableComponent.css';
import { Card, Header } from 'semantic-ui-react';

// Components
import CardComponent from 'components/Card/CardComponent';
// I need to update this comp to check whos stable it should display
const MemoStableComponent = React.memo(() => {
  const currentPlayer = useMyPlayer();
  const { currentPlayerIndex, stable, viewingStableId } = currentPlayer;
  const socketServer = useSelector(state => state.socket);
  const lobbyName = useSelector(state => state.game.uri);
  const isReturningCard = useSelector(state => state.isReturningCard);
  const [viewStablePlayer, setViewStablePlayer] = useState(currentPlayer);
  const dispatch = useDispatch();

  // Move to player view???
  const players = useSelector(state => state.players);
  const decks = useSelector(state => state.decks);

  useEffect(() => {
    const viewingPlayer = players.find(player => player.id == viewingStableId);
    setViewStablePlayer(viewingPlayer);
  }, [viewingStableId]);

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
      <Header>{viewStablePlayer ? viewStablePlayer.name : ''}'s Stable</Header>
      { isReturningCard.isTrue ? <Header>Choose Card to Return</Header> : null }
      <Card.Group>
        {
          (viewStablePlayer && viewStablePlayer.stable) && viewStablePlayer.stable.map((card, index) => {
            return <CardComponent index={index} key={card.id} card={card} callback={handleReturnCard}/>
          })
        }
      </Card.Group>
    </div>
  );
})

export default MemoStableComponent
