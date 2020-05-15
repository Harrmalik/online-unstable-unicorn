import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateDecks, setPlayers, endActionPhase } from 'actions';
import './ActionViewComponent.css';
import { Segment } from 'semantic-ui-react';

// Components
import PlayerView from './components/PlayerView/Playerview.js';
import SpectatorView from './components/SpectatorView/SpectatorView.js';

function ActionViewComponent () {
  const isMyTurn = useSelector(state => state.isMyTurn);
  const socketServer = useSelector(state => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    socketServer.on('cardDrew', (updatedDecks, updatedPlayers) => {
      dispatch(updateDecks(updatedDecks));
      dispatch(setPlayers(updatedPlayers));
    })

    socketServer.on('endingActionPhase', (phase, updatedDecks, updatedPlayers) => {
      //TODO maybe make 2 calls based on if decks were updated
      console.log(phase, updatedDecks, updatedPlayers)
      console.log('called ending action phase');
      dispatch(endActionPhase(phase, updatedDecks, updatedPlayers));
    })

    return () => {
      socketServer.removeListener('cardDrew');
      socketServer.removeListener('endingActionPhase');
    }
  }, [socketServer]);

  return (
    <Segment raised id="actionView">
      <MemoPhase/>
      { isMyTurn ? <PlayerView/> : <SpectatorView/> }
    </Segment>
  );
}

const MemoPhase = React.memo(() => {
  const phases = useSelector(state => state.game.phases);
  const phase = useSelector(state => state.game.phase);

  return (
    <div>{ phases[phase].name} Phase</div>
  )
})

export default ActionViewComponent
