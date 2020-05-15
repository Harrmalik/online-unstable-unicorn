import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { setCurrentPlayer } from 'actions';

export function useMyServer() {
  const urlParams = useParams().id;

  const [socketServer, setMySocketServer] = useState({});

  return socketServer
}

export function useMyPlayer() {
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
