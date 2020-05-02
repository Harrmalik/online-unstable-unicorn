import React, { useState, useEffect } from "react";
import { Card, Label, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Field.css';

function Field(props) {

  return (
    <div class="field">
      {
        Object.keys(props.decks).map(deckKey => {
          return (
          <Card raised className="nursery">
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

export default connect(
  mapStateToProps
)(Field)
