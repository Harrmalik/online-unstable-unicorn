import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Card, Image } from 'semantic-ui-react';
import { viewStable, toggleViewingOtherPlayerModal } from 'actions';
import './PlayersView.css';
import { useMyPlayer } from 'utils/hooks.js';


// const [isViewingOtherPlayer, setIsViewingOtherPlayer] = useState(false);
// const [playerToView, setPlayerToView] = useState(false);

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

// function viewStableModal(selectedPlayer) {
//   props.viewStable(currentPlayer, selectedPlayer);
//   setPlayerToView(null);
//   setIsViewingOtherPlayer(false);
// }
// function close() {
//   setPlayerToView(null);
//   setIsViewingOtherPlayer(false);
// }

// let stablePlayer = props.players.find(player => player.id == currentPlayer.viewingStableId);
// if (props.game.playing) {
//   return (
//     <div style={{display: !props.game.playing ? 'none' : 'block'}}>
//         <PlayersView viewPlayer={viewPlayer} players={props.players}/>
//         {/* <Field player={currentPlayer}></Field> */}
//         <ViewOtherPlayer isOpen={isViewingOtherPlayer}
//             playerToView={playerToView}
//             viewStableModal={viewStableModal}
//             close={close} />
//         {/* <ActionViewComponent/> */}
//         {/* <HandComponent hand={currentPlayer.hand}/> */}
//         <StableComponent playerName={stablePlayer.name} stable={stablePlayer.stable}/>
//     </div>
//   );
// }
function PlayersView() {
  const currentPlayer = useMyPlayer();
  const [selectedPlayer, setSelectedPlayer] = useState(false);
  const game = useSelector(state => state.game);
  const players = useSelector(state => state.players);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedPlayer)
      return;

    if (currentPlayer.id == selectedPlayer.id) {
      // This happens when you click yourself
      // dispatch(toggleViewingOtherPlayerModal(currentPlayer, selectedPlayer.id));
      dispatch(viewStable(currentPlayer, null));
    } else if (game.whosTurn.id == currentPlayer.id) {
      // Only the player whos turn it is should be able to view a hand/stable
      // dispatch(viewStable(currentPlayer, selectedPlayer));
      dispatch(toggleViewingOtherPlayerModal(currentPlayer, selectedPlayer.id));
    } else {
      // This is hit when a player whos turn its not clicks a stable.
      dispatch(viewStable(currentPlayer, selectedPlayer));
    }
  }, [selectedPlayer]);

  return (
    <div id="players-view">
      <Card.Group itemsPerRow={1}>
        {players.map(player => {
          return (
            <Card onClick={() => {setSelectedPlayer(player)}} raised key={player.id}>
              <Image
              label={{
                  color: player.color,
                  content: `${player.name}: H: ${player.hand.length} S: ${player.stable.length}`,
                  ribbon: true
                }}
               src={player.unicorn.url}/>
            </Card>
          )
        })}
      </Card.Group>
    </div>
  );
}

export default PlayersView;
