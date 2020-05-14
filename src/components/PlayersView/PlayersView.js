import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Image } from 'semantic-ui-react';
import { viewStable } from 'actions';
import './PlayersView.css'

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
