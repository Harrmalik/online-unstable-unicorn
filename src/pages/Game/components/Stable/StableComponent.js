import React from "react";
import { Card, Header } from 'semantic-ui-react';
import './StableComponent.css';

import CardComponent from 'components/Card/CardComponent';

function StableComponent(props) {
  return (
    <div className="stable">
      <Header>{props.playerName}'s Stable</Header>
      <Card.Group>
        {props.stable.map(card => {
          return <CardComponent key={card.id} card={card}/>
        })}
      </Card.Group>
    </div>
  );
}

export default StableComponent
