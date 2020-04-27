import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import { setPlayers, startGame } from 'actions';
const ENDPOINT = "http://127.0.0.1:3001";

function StableComponent(props) {
  const [players, setPlayers] = useState(props.players);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.emit('drawCard', 'hey')
  }, []);


  return (
    <div style={{display: props.game.playing ? 'none' : 'block'}}>
      hi
    </div>
  );
}

const mapStateToProps = state => ({
  players: state.players,
  game: state.game
})

const mapDispatchToProps = dispatch => ({
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StableComponent)
