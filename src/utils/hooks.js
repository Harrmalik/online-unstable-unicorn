import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { setCurrentPlayer } from 'actions';
import groupBy from 'lodash/groupBy';

export function useMyServer() {
  const urlParams = useParams().id;

  const [socketServer, setMySocketServer] = useState({});

  return socketServer
}

// export function useViewPlayerModal(selectedPlayer) {
//   // const [isViewingOtherPlayer, setIsViewingOtherPlayer] = useState(false);
//   // const [playerToView, setPlayerToView] = useState(false);

//   const game = useSelector(state => state.game);
//   // const currentPlayerIndex = useSelector(state => state.currentPlayerIndex);
//   // const players = useSelector(state => state.players);
//   // const currentPlayer = players[currentPlayerIndex];
//   const currentPlayer = useMyPlayer();
//   const dispatch = useDispatch();
//   if (currentPlayer.id == selectedPlayer.id) {
//     // setIsViewingOtherPlayer(false);
//     dispatch(toggleViewingOtherPlayerModal(false));
//     dispatch(viewStable(currentPlayer, null));
//   } else if (game.whosTurn.id == currentPlayer.id) {
//     // setPlayerToView(selectedPlayer);
//     dispatch(viewStable(currentPlayer, selectedPlayer));
//     // setIsViewingOtherPlayer(true);
//     dispatch(toggleViewingOtherPlayerModal(true));
//   } else {
//     // This is hit when a player whos turn it is clicks a stable.
//     dispatch(viewStable(currentPlayer, selectedPlayer));
//   }
// }

export function useViewingPlayer() {
  const players = useSelector(state => state.players);
  const me = useMyPlayer();
  return {
    ...players[me.viewingStableId]
  };
}

export function useMyPlayer() {
  // TODO: make this render less times
  const [myPlayer, setMyPlayer] = useState({
    hand: [],
    stable: []
  });
  const currentPlayerIndex = useSelector(state => state.currentPlayerIndex);
  const players = useSelector(state => state.players);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!currentPlayerIndex) {
      dispatch(setCurrentPlayer(localStorage.getItem('currentPlayerIndex')));
    }

    if (players[currentPlayerIndex]) {
      setMyPlayer({
        currentPlayerIndex,
        ...players[currentPlayerIndex]
      })
    }

  }, [players, currentPlayerIndex])

  return myPlayer;
}

export function useCheckForInstants() {
  const currentPlayerIndex = useSelector(state => state.currentPlayerIndex);
  const myHand = useSelector(state => state.players[currentPlayerIndex].hand);
  const [instantActions, setInstantActions] = useState([])

  useEffect(() => {
    console.log('CHECKING FOR INSTANTS', myHand)
    let newActions = [];
    const cardTypes = groupBy(myHand, 'type');
    if (cardTypes['Instant']) {
      newActions = cardTypes['Instant'].map(instant => {
        return {
          id: instant.id,
          name: instant.name
        }
      })
    }

    setInstantActions([
      {
        id: 0,
        name: 'Skip'
      },
      ...newActions
    ])
  }, [myHand])

  return instantActions;
}
