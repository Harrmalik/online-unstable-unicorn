import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { endGame } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import './StableComponent.css';
import { Card, Header } from 'semantic-ui-react';

// Components
import CardComponent from 'components/Card/CardComponent';

const MemoStableComponent = React.memo(() => {
  const { name, stable } = useMyPlayer();
  const dispatch = useDispatch();

  useEffect(() => {
    if (stable && stable.length === 7) {
      console.log('ENDING THE GAME');
      dispatch(endGame());
    }
  }, [stable])

  return (
    <div className="stable">
      <Header>{name}'s Stable</Header>
      <Card.Group>
        {
          stable && stable.map(card => {
            return <CardComponent key={card.id} card={card}/>
          })
        }
      </Card.Group>
    </div>
  );
})

export default MemoStableComponent
