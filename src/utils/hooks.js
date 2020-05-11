import { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from "react-redux";

export function useMyPlayer() {
  const [myPlayer, setMyPlayer] = useState({});


  return myPlayer;
}
