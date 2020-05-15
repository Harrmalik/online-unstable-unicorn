import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Image } from 'semantic-ui-react';
import { viewStable } from 'actions';
import './PlayersView.css'


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
function PlayersView(props) {
  return (
    <div id="players-view">
      <Card.Group itemsPerRow={1}>
        {props.players.map(player => {
          return (
            <Card onClick={() => {props.viewPlayer(player)}} raised key={player.id}>
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

const mapStateToProps = state => ({
  currentPlayer: state.currentPlayer,
  players: state.players
})

const mapDispatchToProps = dispatch => ({
  viewStable: bindActionCreators(viewStable, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayersView)
