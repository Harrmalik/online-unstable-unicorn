import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { updateDecks, setPlayers } from 'actions';
import { Card, Label, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Field.css';

function Field(props) {
  // const [drawPile, setDrawPile] = useState(props.decks.drawPile);
  // const [nursery, setNursery] = useState(props.decks.nursery);
  // const [discardPile, setDiscardPile] = useState(props.decks.discardPile);
  // const [player, setPlayer] = useState(props.player);
  const [isMyTurn, setIsMyTurn] = useState(props.game.whosTurn.id == props.currentPlayer);
  // const [players, setPlayers] = useState(props.players);

  function clickDeck(deckKey) {
    const currentDeck = props.decks[deckKey];

    switch (deckKey) {
      case 'drawPile':
        const nextCard = currentDeck.splice(0, 1);
        props.player.hand.push(nextCard);
        break;
      case 'nursery':

        break;
      case 'discardPile':

        break;
      default:
        updateDecks(deckKey, props.decks[deckKey]);
        // updateHand(props.player.hand);
        // io.emit('drawCard', props.decks, props.players)
    }

    if (deckKey == 'drawPile') {


    }
  }

  useEffect(() => {
    props.socket.on('cardDrew', (updateDecks, updatedPlayers) => {
      props.updateDecks(updateDecks)
      props.setPlayers(updatedPlayers);
    })
  })

  function drawCard(numCards = 1) {
    if (props.isMyTurn) {
      let drawPile = props.decks.drawPile;
      let player = props.player;
      let players = props.players;

      const nextCards = drawPile.splice(0, numCards);
      player.hand = [...player.hand, ...nextCards];
      players[props.currentPlayer - 1] = player

      props.socket.emit('drawCard', drawPile, players)
    }
  }

  return (
    <div className="field">
      {
        Object.keys(props.decks).map(deckKey => {
          return <Deck key={deckKey} id={deckKey} numCards={props.decks[deckKey].length} callback={drawCard}/>
        })
      }
    </div>
  )
}

function Deck(props) {
  return (
    <Card id={props.id} raised onClick={() => { props.callback(1) }}>
      <Image
      label={{
          color: 'black',
          content: `${props.id}: ${props.numCards}`,
          ribbon: true
        }}
        src={`/images/cardBack.jpg`}/>
    </Card>
  )
}

const mapStateToProps = state => ({
  socket: state.socket,
  currentPlayer: state.currentPlayer,
  game: state.game,
  decks: state.decks,
  isMyTurn: state.isMyTurn,
  players: state.players
})

const mapDispatchToProps = dispatch => ({
  updateDecks: bindActionCreators(updateDecks, dispatch),
  setPlayers: bindActionCreators(setPlayers, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field)
