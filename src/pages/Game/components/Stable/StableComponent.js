import React from "react";

import CardComponent from 'components/Card/CardComponent';

function StableComponent(props) {
  return (
    <div>
      {props.hand.map(card => {
        return <CardComponent key={card.id} card={card}/>
      })}
    </div>
  );
}

export default StableComponent
