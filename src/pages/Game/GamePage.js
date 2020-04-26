import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setUsers, startGame } from './../../actions';
const ENDPOINT = "http://127.0.0.1:3001";

function GamePage(props) {
  return (
    <div style={{display: !props.game.playing ? 'none' : 'block'}}>
      // Each should be a separate component
      //////////////////////////////////////



      // PlayersUI -> user avatar + num cards in hands
      // Decks UI [draw, nursery, discard]
      // stables -> cards in play for each user
      // My hand -> cards view -> quick view and click for more details
      // Options -> for later
    </div>
  );
}

// NOTES
//-------------


// Reducers folder -> contains state object for entire App
// Action folder -> contains functions to be imported from -> import { setUsers, startGame } from './../../actions';
// mapStateToProps maps the state object from reducers to be used in a component
// mapDispatchToProps maps actions to be called in a component
// To call a dispatch user `props.[functionName]`
// socketIOClient.emit('functionName') for later user but an FYI

const mapStateToProps = state => ({
  users: state.users,
  game: state.game
})

const mapDispatchToProps = dispatch => ({
    setUsers: bindActionCreators(setUsers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
