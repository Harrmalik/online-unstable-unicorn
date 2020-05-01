import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import './HomePage.css';
import { setPlayers, startGame } from 'actions';
import GroupBy from 'lodash/groupBy';
import Remove  from 'lodash/remove';
import Shuffle  from 'lodash/shuffle';
import { Dropdown, Image, Item, Segment } from 'semantic-ui-react';
const ENDPOINT = "http://127.0.0.1:3001";

const socket = socketIOClient(ENDPOINT);
const colors = ['purple', 'blue', 'teal', 'green', 'yellow', 'orange', 'red'];

function HomePage(props) {
  const [username, setUsername] = useState("");
  const [unicorn, setUnicorn] = useState({});
  const [babyUnicorns, setBabyUnicorns] = useState(GroupBy(props.game.cards, 'type')['Baby Unicorn']);

  useEffect(() => {
    socket.on('player added', players => {
      props.setPlayers(players)
    })
    // Uncomment this to start game on load
    // startGame()
  }, []);

  function addPlayer() {
    const newPlayer = {
      id: props.players.length + 1,
      color: colors[props.players.length + 1],
      name: username,
      unicorn,
      hand: [unicorn]
    };
    const updatedPlayers = [...props.players, newPlayer]

    let unicornsLeft = babyUnicorns.splice(unicorn.index, 1);
    setBabyUnicorns(babyUnicorns);
    setUsername("")
    setUnicorn({})
    socket.emit('add player', updatedPlayers)
  }

  function selectUnicorn(unicorn, index) {
    setUnicorn({
      index,
      ...unicorn
    });
  }

  function deal(deck, players = props.players) {
    let dealAmount = players.length < 6 ? 5 : 6;
    for (let i = 0; i < (players.length * dealAmount); i++ ){
      const playerIndex = i % players.length;
      const card = deck.splice(0,1)[0];
      players[playerIndex].hand.push(card);
    }
    return [deck, players];
  }

  function startGame() {
    Remove(props.game.cards, c => {
      return c.type === 'Baby Unicorn'
    })

    const [drawPile, players] = deal(Shuffle(props.game.cards), props.players)

    props.startGame({}, {
      drawPile,
      nursery: babyUnicorns,
      discardPile: []
    },
    players)
  }

  return (
    <div style={{display: props.game.playing ? 'none' : 'block'}}>
    <Dropdown
      text='Select Unicorn'
      icon='plus'
      floating
      labeled
      button
      className='icon'
    >
      <Dropdown.Menu>
        <Dropdown.Header content='Unicorns Available' />
        {babyUnicorns.map((option, i) => (
          <Dropdown.Item onClick={() => { selectUnicorn(option, i)}} key={option.id} text={option.name} image={`images/${option.id}.jpg`}  />
        ))}
      </Dropdown.Menu>
    </Dropdown>
      {unicorn.id ? <Image src={`images/${unicorn.id}.jpg`} avatar /> : null }
      Add Player: <input value={username} id="addUserText" onChange={(e) => setUsername(e.target.value)} /> <button onClick={addPlayer}>Add</button>

      <h2>Players</h2>
      <Item.Group style={{width: '500px'}}>
        {props.players.map(player => {
          return (
            <Segment key={player.id} inverted color={player.color}>
              <Item>
                <Item.Image size='tiny' src={`images/${player.unicorn.id}.jpg`} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header>{player.name}</Item.Header>
                </Item.Content>
              </Item>
            </Segment>
          )
        })}
      </Item.Group>


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
