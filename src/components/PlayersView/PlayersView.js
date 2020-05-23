import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Segment, Card, Image } from 'semantic-ui-react';
import { viewStable, toggleViewingOtherPlayerModal } from 'actions';
import './PlayersView.scss';
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

// Components
import ModalComponent from 'components/Modal/ModalComponent';

function PlayersView() {
  const currentPlayer = useMyPlayer();
  const [selectedPlayer, setSelectedPlayer] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [playerHovered, setPlayerHover] = useState({});
  const game = useSelector(state => state.game);
  const players = useSelector(state => state.players);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!selectedPlayer)
      return;

    if (currentPlayer.id == selectedPlayer.id) {
      dispatch(toggleViewingOtherPlayerModal(false));
      dispatch(viewStable(currentPlayer, null));
    } else if (game.whosTurn.id == currentPlayer.id) {
      // Only the player whos turn it is should be able to view a hand/stable
      dispatch(viewStable(currentPlayer, selectedPlayer));
      dispatch(toggleViewingOtherPlayerModal(true));
    } else {
      // This is hit when a player whos turn it is clicks a stable.
      dispatch(viewStable(currentPlayer, selectedPlayer));
    }
  }, [selectedPlayer]);

  // useEffect(() => {
  //   if (currentPlayer.id) {
  //     setPlayerHover({...currentPlayer, index: 1});
  //     setShowQuickView(true);
  //   }
  // }, [currentPlayer])

  function toggleQuickView(player, index) {
    setPlayerHover({
      ...player,
      index
    });
    setShowQuickView(!showQuickView);
  }

  function renderQuickView() {
    if (showQuickView && playerHovered.id) {
      return <QuickViewComponent
        stable={playerHovered.stable}
        index={playerHovered.index}
      />
    }
  }

  return (
    <div id="players-view">
      <Card.Group itemsPerRow={1}>
        {players.map((player, index) => {
          return (
            <Card
              raised
              id={`playercard-${index}`}
              key={player.id}
              onClick={() => {setSelectedPlayer(player)}}>
              <Image

              onMouseEnter={() => { toggleQuickView(player, index) }}
              onMouseLeave={() => { toggleQuickView({}) }}
              label={{
                  color: player.color,
                  content: `${player.name}: H: ${player.hand.length} S: ${player.stable.length}`,
                  ribbon: true
                }}
               src={player.unicorn.url}/>
            </Card>
          )
        })}
        {renderQuickView()}
      </Card.Group>
    </div>
  );
}

function QuickViewComponent(props) {
  const { stable, index } = props;
  const blankCards = [{}, {}, {}, {}, {}, {}, {}]
  const MAX_CARDS = 7;
  const cardPosition = document.getElementById(`playercard-${index}`).getBoundingClientRect();

  return <Segment inverted style={{left: `${cardPosition.x + 150}px`, top: `${cardPosition.top- 40}px`}}>
  {stable.map(card => {
    return (
      <Card
        raised
        key={card.id}>
        <Image src={card.url}/>
      </Card>
    )
  })}

  {blankCards.map((card, index) => {
    if (index < MAX_CARDS - stable.length) {
      return (
        <Card
          raised
          key={index}>
          <Image style={{height: `${cardPosition.height}px`}} src={`/images/cardBack.jpg`}/>
        </Card>
      )
    }
  })}
  </Segment>
}

export default PlayersView;
