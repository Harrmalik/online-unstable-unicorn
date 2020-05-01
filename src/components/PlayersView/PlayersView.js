import React from "react";
import { Card, Label, Image } from 'semantic-ui-react';
import './PlayersView.css'

function PlayersView(props) {
  return (
    <div id="players-view">
      <Card.Group itemsPerRow={1}>
        {props.players.map(player => {
          return (
            <Card raised key={player.id} image={`images/${player.unicorn.id}.jpg`}>
              <Image
              label={{
                  color: player.color,
                  content: `${player.name}: H: ${player.hand.length} S: ${player.stable.length}`,
                  ribbon: true
                }}
               src={`images/${player.unicorn.id}.jpg`}/>
            </Card>
          )
        })}
      </Card.Group>
    </div>
  );
}

export default PlayersView
