import React from "react";
import { Card } from 'semantic-ui-react'

function CardComponent(props) {
  return (
    <div>
      <Card raised link
        image={`./../images/${props.card.id}.jpg`}
        header={props.card.name}
        meta={props.card.type}
        description={props.card.description}
      />
    </div>
  );
}

export default CardComponent
