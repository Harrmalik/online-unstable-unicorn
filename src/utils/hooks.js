import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

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
  const [myPlayer, setMyPlayer] = useState({});


  return myPlayer;
}
