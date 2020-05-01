import React from "react";
import { Card, Popup, Image } from 'semantic-ui-react';
import './CardComponent.css';

function CardComponent(props) {
  return (
    <Popup inverted
      trigger={
        <Card>
          <Image src={`images/${props.card.id}.jpg`} />
          <Card.Content>
            <Card.Header>{props.card.name}</Card.Header>
          </Card.Content>
        </Card>
      }
    >
      <Popup.Header>{props.card.type}</Popup.Header>
      <Popup.Content>
        {props.card.description}
      </Popup.Content>
    </Popup>
  );
}



export default CardComponent
