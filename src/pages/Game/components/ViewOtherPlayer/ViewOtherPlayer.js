import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from 'semantic-ui-react';
import { viewStable, toggleViewingOtherPlayerModal } from 'actions';
import { useViewingPlayer, useMyPlayer } from 'utils/hooks.js';

function ViewOtherPlayer(props) {
  const dispatch = useDispatch();
  const currentPlayer = useMyPlayer();
  const playerToView = useViewingPlayer();
  // const name = playerToView ? props.playerToView.name : '';
  const [isViewingHand, setisViewingHand] = useState(false);
  function viewHand() {
    setisViewingHand(true);
  }

  function viewStableModal(selectedPlayer) {
    // props.viewStable(currentPlayer, selectedPlayer);
    dispatch(viewStable(currentPlayer, selectedPlayer));
    // setPlayerToView(null);
    // setIsViewingOtherPlayer(false);
  }

  function close() {
    setisViewingHand(false);
    // props.close();
    // useViewPlayerModal(currentPlayer);
    dispatch(toggleViewingOtherPlayerModal(false));
    dispatch(viewStable(currentPlayer, null));
  }

  return (
    <Modal
      open={props.isOpen}
      closeOnEscape={false}
      closeOnDimmerClick = {false}>
      <Modal.Header>View {playerToView.name}'s </Modal.Header>
      {isViewingHand &&
        <Modal.Content>
          {playerToView.hand.map(card => {
            return(
              <p>{card.name}</p>
            )
          })}
        </Modal.Content>
      }
        {!isViewingHand &&
        <Modal.Actions center>
          <Button onClick={() => { viewStableModal(playerToView) }}>
            Stable
          </Button>
          <Button
            onClick={viewHand}
            content='Hand'
          />
        </Modal.Actions>
        }
        {isViewingHand &&
        <Modal.Actions center>
          <Button onClick={close}>
            Close
          </Button>
        </Modal.Actions>
        }
    </Modal>
  )
}

export default ViewOtherPlayer