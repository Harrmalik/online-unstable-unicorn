import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { updateDeck, updateHand } from 'actions';
import { Card, Label, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Field.css';

function Field(props) {
  function clickDeck(deckKey) {
    if (deckKey == 'drawPile') {
      const nextCard = props.decks[deckKey].splice(0, 1);
      props.player.hand.push(nextCard);
      updateDeck(props.decks[deckKey]);
      updateHand(props.player.hand);
    }
  }

  return (
    <div className="field">
      {
        Object.keys(props.decks).map(deckKey => {
          return (
          <Card key={deckKey} raised className="nursery" onClick={() => { clickDeck(deckKey)}}>
            <Image
            label={{
                color: 'black',
                content: `${deckKey}`,
                ribbon: true
              }}
              src={`images/cardBack.jpg`}/>
          </Card>
          )
        })
      }
    </div>
  )
}

const mapStateToProps = state => ({
  game: state.game,
  decks: state.decks
})

const mapDispatchToProps = dispatch => ({
  updateDeck: bindActionCreators(updateDeck, dispatch),
  updateHand: bindActionCreators(updateHand, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field)
