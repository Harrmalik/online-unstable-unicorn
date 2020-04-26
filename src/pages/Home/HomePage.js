import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import './HomePage.css';
import { setUsers, startGame } from './../../actions';
const ENDPOINT = "http://127.0.0.1:3001";

function HomePage(props) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });

    socket.emit('drawCard', 'hey')
  }, []);



  function addUser() {
    const updatedUsers = [...users, username]
    setUsers(updatedUsers)
    setUsername("")
    props.setUsers(updatedUsers)
  }

  function startGame() {
    props.startGame()
  }

  return (
    <div style={{display: props.game.playing ? 'none' : 'block'}}>
      Add Player: <input value={username} id="addUserText" onChange={(e) => setUsername(e.target.value)} /> <button onClick={addUser}>Add</button>

      <h2>Players</h2>
      {users.map(user => {
        return <p>{user}</p>
      })}

      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

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
)(HomePage)
