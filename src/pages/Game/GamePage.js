import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { startGame } from 'actions';
import { useMyPlayer } from 'utils/hooks.js';
import { useHistory, useParams } from 'react-router-dom';
import './GamePage.css';

// Components
import PlayersView from 'components/PlayersView/PlayersView.js';
import Field from './components/Field/Field.js';
import StableComponent from './components/Stable/StableComponent';
import ActionViewComponent from './components/ActionView/ActionViewComponent.js';
import HandComponent from './components/Hand/HandComponent';
import ViewOtherPlayer from './components/ViewOtherPlayer/ViewOtherPlayer.js';

const MemoGamePage = React.memo(GamePage);

function GamePage() {
  const myPlayer = useMyPlayer();
  const isPlaying = useSelector(state => state.game.playing);
  const socketServer = useSelector(state => state.socket);
  const lobbyName = useParams().id;
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPlaying) {
      socketServer.on('reconnect', (options, decks, players) => {
        if (options.playing) {
          dispatch(startGame(options, decks, players, false))
        } else {
          history.push('/');
        }

        socketServer.removeListener('reconnect')
      })

      socketServer.emit('checkForRoom', lobbyName)
    }
  }, [isPlaying])
  console.log('render game page')

  return (
    <div>
      <PlayersView/>
      <Field/>
      <ActionViewComponent/>
      <HandComponent/>
      <StableComponent/>
    </div>
  );
}

export default MemoGamePage
