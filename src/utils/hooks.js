import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { setCurrentPlayer } from 'actions';

export function useCurrentPlayerIndex() {
  const currentPlayer = useSelector(state => state.currentPlayer);

  return currentPlayer;
}

export function useMyServer() {
  const urlParams = useParams().id;

  const [socketServer, setMySocketServer] = useState({});

  return socketServer
}

// export function useMyServer() {
//   const urlParams = useParams().id;
//
//   const [socketServer, setMySocketServer] = useState({});
//
//   return server
// }

export function useMyPlayer() {
  const [myPlayer, setMyPlayer] = useState({
    hand: [],
    stable: []
  });
  const currentPlayerIndex = useSelector(state => state.currentPlayerIndex);
  const players = useSelector(state => state.players);
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('currentPlayerIndex: ', currentPlayerIndex)
    if (!currentPlayerIndex) {
      console.log('no currentPlayerIndex')
      dispatch(setCurrentPlayer(localStorage.getItem('currentPlayerIndex')));
    }

    if (players[currentPlayerIndex]) {
      console.log('got player ', players[currentPlayerIndex])
      setMyPlayer(players[currentPlayerIndex])
    }
    console.log('playerrrrrrs')
  }, [players, currentPlayerIndex])

  return myPlayer;
}
