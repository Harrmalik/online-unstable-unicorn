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
      dispatchUpdates(updatedDecks, updatedPlayers)
    })

    socketServer.on('cardDiscarded', (card, updatedDecks, updatedPlayers) => {
      dispatchUpdates(updatedDecks, updatedPlayers)
    })

    socketServer.on('cardDestroyed', (card, updatedDecks, updatedPlayers) => {
      dispatchUpdates(updatedDecks, updatedPlayers)
    })

    socketServer.on('cardSacrificed', (card, updatedDecks, updatedPlayers) => {
      dispatchUpdates(updatedDecks, updatedPlayers)
    })

    socketServer.on('cardReturned', (card, updatedDecks, updatedPlayers) => {
      dispatchUpdates(updatedDecks, updatedPlayers)
    })

    socketServer.on('endingActionPhase', (phase, updatedDecks, updatedPlayers) => {
      dispatch(endActionPhase(phase, updatedDecks, updatedPlayers));
    })

    return () => {
      socketServer.removeListener('cardDrew');
      socketServer.removeListener('cardDiscarded');
      socketServer.removeListener('cardDestroyed');
      socketServer.removeListener('cardSacrificed');
      socketServer.removeListener('cardReturned');
      socketServer.removeListener('endingActionPhase');
    }
  }, [socketServer]);

  function dispatchUpdates(updatedDecks, updatedPlayers) {
    dispatch(updateDecks(updatedDecks));
    dispatch(setPlayers(updatedPlayers));
  }

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
