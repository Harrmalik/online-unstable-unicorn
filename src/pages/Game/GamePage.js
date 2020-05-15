import React, { useState, useEffect} from "react";
import './GamePage.css';
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { startGame, viewStable } from 'actions';
import StableComponent from './components/Stable/StableComponent';
import HandComponent from './components/Hand/HandComponent';
import Field from './components/Field/Field.js';
import ActionViewComponent from './components/ActionView/ActionViewComponent.js';
import ViewOtherPlayer from './components/ViewOtherPlayer/ViewOtherPlayer.js';
import PlayersView from 'components/PlayersView/PlayersView.js';
import { useMyPlayer } from 'utils/hooks.js';
import { useHistory } from 'react-router-dom';


const MemoGamePage = React.memo(GamePage);

function GamePage() {
  const myPlayer = useMyPlayer();
  const isPlaying = useSelector(state => state.game.playing)
  const history = useHistory();
  // const currentPlayer = props.players.find(player => player.id == props.currentPlayer);
  // const [isViewingOtherPlayer, setIsViewingOtherPlayer] = useState(false);
  // const [playerToView, setPlayerToView] = useState(false);
  //
  // function viewPlayer (selectedPlayer) {
  //   if (currentPlayer.id == selectedPlayer.id) {
  //     setIsViewingOtherPlayer(false);
  //     props.viewStable(currentPlayer, null);
  //   } else if (props.game.whosTurn.id == currentPlayer.id) {
  //     setPlayerToView(selectedPlayer);
  //     setIsViewingOtherPlayer(true);
  //   } else {
  //     props.viewStable(currentPlayer, selectedPlayer);
  //   }
  // }
  //
  // function viewStableModal(selectedPlayer) {
  //   props.viewStable(currentPlayer, selectedPlayer);
  //   setPlayerToView(null);
  //   setIsViewingOtherPlayer(false);
  // }
  // function close() {
  //   setPlayerToView(null);
  //   setIsViewingOtherPlayer(false);
  // }
  //
  // let stablePlayer = props.players.find(player => player.id == currentPlayer.viewingStableId);
  // if (props.game.playing) {
  //   return (
  //     <div style={{display: !props.game.playing ? 'none' : 'block'}}>
  //         <PlayersView viewPlayer={viewPlayer} players={props.players}/>
  //         <Field player={currentPlayer}></Field>
  //         <ViewOtherPlayer isOpen={isViewingOtherPlayer}
  //             playerToView={playerToView}
  //             viewStableModal={viewStableModal}
  //             close={close} />
  //         <ActionViewComponent/>
  //         <HandComponent hand={currentPlayer.hand}/>
  //         <StableComponent playerName={stablePlayer.name} stable={stablePlayer.stable}/>
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (!isPlaying) {
      history.push('/');
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
