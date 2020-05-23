import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateDecks, setPlayers, endActionPhase } from 'actions';
import './ActionViewComponent.scss';
import { Segment, Step } from 'semantic-ui-react';

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

    socketServer.on('updateFromAction', (updatedDecks, updatedPlayers) => {
      dispatchUpdates(updatedDecks, updatedPlayers)
    })

    socketServer.on('endingActionPhase', () => {
      dispatch(endActionPhase());
    })

    return () => {
      socketServer.removeListener('cardDrew');
      socketServer.removeListener('cardDiscarded');
      socketServer.removeListener('cardDestroyed');
      socketServer.removeListener('cardSacrificed');
      socketServer.removeListener('cardReturned');
      socketServer.removeListener('updateFromAction');
      socketServer.removeListener('endingActionPhase');
    }
  }, [socketServer]);

  function dispatchUpdates(updatedDecks, updatedPlayers) {
    dispatch(updateDecks(updatedDecks));
    dispatch(setPlayers(updatedPlayers));
  }

  return (
    <div id="actionView">
      <MemoPhase/>
      <Segment raised attached>
        { isMyTurn ? <PlayerView/> : <SpectatorView/> }
      </Segment>
    </div>
  );
}

const MemoPhase = React.memo(() => {
  const phases = useSelector(state => state.game.phases);
  const currentPhase = useSelector(state => state.game.phase);

  return (
    <Step.Group attached='top' fluid>
      { phases.map(phase => <Step
          active={phases[currentPhase].name === phase.name}
          disabled={false}
        >
          <Step.Content>
            <Step.Title>{phase.name}</Step.Title>
            {/*
              TODO: show number of actions per phase
              <Step.Description>Choose your shipping options</Step.Description>
            */}
          </Step.Content>
        </Step>
      )}
    </Step.Group>
  )
})

export default ActionViewComponent
