import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Card, Image } from 'semantic-ui-react';
import { viewStable, toggleViewingOtherPlayerModal } from 'actions';
import './PlayersView.css';
import { useMyPlayer } from 'utils/hooks.js';

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
      dispatch(viewStable(currentPlayer, null));
    } else if (game.whosTurn.id == currentPlayer.id) {
      // Only the player whos turn it is should be able to view a hand/stable
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
