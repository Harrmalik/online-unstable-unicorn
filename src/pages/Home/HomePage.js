import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import './HomePage.css';
import { setPlayers, startGame } from './../../actions';
const ENDPOINT = "http://127.0.0.1:3001";

function HomePage(props) {
  const [players, setPlayers] = useState(props.players);
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });

    socket.emit('drawCard', 'hey')
  }, []);



  function addPlayer() {
    const updatedPlayers = [...players, username]
    setPlayers(updatedPlayers)
    setUsername("")
    props.setUsers(updatedPlayers)
  }

  function startGame() {
    props.startGame()
  }

  return (
    <div style={{display: props.game.playing ? 'none' : 'block'}}>
      Add Player: <input value={username} id="addUserText" onChange={(e) => setUsername(e.target.value)} /> <button onClick={addPlayer}>Add</button>

      <h2>Players</h2>
      {players.map(player => {
        return <p>{player.name}</p>
      })}

      <button onClick={startGame}>Start Game</button>
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
)(HomePage)
