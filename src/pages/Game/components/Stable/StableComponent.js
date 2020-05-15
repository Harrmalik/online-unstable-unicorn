import React from "react";
import { Card, Header } from 'semantic-ui-react';
import './StableComponent.css';
import { useMyPlayer } from 'utils/hooks.js'

import CardComponent from 'components/Card/CardComponent';

function StableComponent() {
  const myPlayer = useMyPlayer()
  return (
    <div className="stable">
      <Header>{myPlayer.name}'s Stable</Header>
      <Card.Group>
        {myPlayer.stable.map(card => {
          return <CardComponent key={card.id} card={card}/>
        })}
      </Card.Group>
    </div>
  );
}

export default StableComponent
