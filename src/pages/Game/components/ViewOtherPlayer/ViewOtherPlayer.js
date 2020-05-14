import React, { useState } from "react";
import { Button, Modal } from 'semantic-ui-react'

function ViewOtherPlayer(props) {
  const name = props.playerToView ? props.playerToView.name : '';
  const [isViewingHand, setisViewingHand] = useState(false);
  function viewHand() {
    setisViewingHand(true);
  }

  function close() {
    setisViewingHand(false);
    props.close();
  }

  return (
    <Modal
      open={props.isOpen}
      closeOnEscape={false}
      closeOnDimmerClick = {false}>
      <Modal.Header>View {name}'s </Modal.Header>
      {isViewingHand &&
        <Modal.Content>
          {props.playerToView.hand.map(card => {
            return(
              <p>{card.name}</p>
            )
          })}
        </Modal.Content>
      }
        {!isViewingHand &&
        <Modal.Actions center>
          <Button onClick={() => { props.viewStableModal(props.playerToView) }}>
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