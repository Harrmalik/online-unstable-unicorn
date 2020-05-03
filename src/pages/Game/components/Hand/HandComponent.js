import React from "react";
import { Card } from 'semantic-ui-react';
import './HandComponent.css';

import CardComponent from 'components/Card/CardComponent';

function HandComponent(props) {
  function playCard() {
    // 
  }

  return (
    <div className="stable">
      <Card.Group>
        {props.hand.map(card => {
          return <CardComponent key={card.id} card={card}/>
        })}
      </Card.Group>
    </div>
  );
}

export default HandComponent
