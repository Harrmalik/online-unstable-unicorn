import React from "react";
import { useSelector } from 'react-redux';
import { Card, Image } from 'semantic-ui-react';
import './Field.css';

const MemoField = React.memo(Field);

function Field() {
  const decks = useSelector(state => state.decks);

  return (
    <div className="field">
      {
        Object.keys(decks).map(deckKey => {
          return <MemoDeck id={deckKey} key={deckKey} numCards={decks[deckKey].length}/>
        })
      }
    </div>
  )
}

const MemoDeck = React.memo(Deck);

function Deck(props) {
  const {id, numCards} = props;
  
  return (
    <Card raised>
      <Image
        label={{
          color: 'black',
          content: `${id}: ${numCards}`,
          ribbon: true
        }}
        src={`/images/cardBack.jpg`}/>
    </Card>
  )
}

export default MemoField
