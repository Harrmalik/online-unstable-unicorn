import React from "react";
import { Card, Header } from 'semantic-ui-react';
import './HandComponent.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { playingCard, playCard } from 'actions';

import CardComponent from 'components/Card/CardComponent';

function HandComponent(props) {
  function playCard(card, index) {
    if (props.isMyTurn && props.isPlayingCard) {
      switch (card.type) {
        case 'Baby Unicorn':
        case 'Basic Unicorn':
        case 'Magical Unicorn':
          let updatedPlayers = [
            ...props.players
          ]

          updatedPlayers[props.currentPlayer - 1].hand.splice(index,1);
          updatedPlayers[props.currentPlayer - 1].stable.push(card);

          props.socket.emit('playCard', card, updatedPlayers)
          console.log('ADDING TO STABLE');

          //
          // props.playCard(card, addToStable)
          break;

        case 'Magic':
        case 'Upgrade':
        case 'Downgrade':
          console.log('PLAYING EFFECT')
          break;
        default:

      }
      console.log(card)
    }
  }

  return (
    <div className="hand">
      { props.isPlayingCard ? <Header>Choose Card to Play</Header> : null }
      <Card.Group>
        {props.hand.map((card, index) => {
          return <CardComponent
            index={index}
            key={card.id}
            card={card}
            isPlayingCard={props.isPlayingCard}
            callback={playCard}/>
        })}
      </Card.Group>
    </div>
  );
}

const mapStateToProps = state => ({
  isMyTurn: state.isMyTurn,
  isPlayingCard: state.isPlayingCard,
  players: state.players,
  currentPlayer: state.currentPlayer,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    playingCard: bindActionCreators(playingCard, dispatch),
    playCard: bindActionCreators(playCard, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HandComponent)
