import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './HomePage.css';
import { setCurrentPlayer, setPlayers, startGame } from 'actions';
import GroupBy from 'lodash/groupBy';
import Remove  from 'lodash/remove';
import Shuffle  from 'lodash/shuffle';
import Reduce  from 'lodash/reduce';
import { Dropdown, Image, Item, Segment } from 'semantic-ui-react';
const colors = ['purple', 'blue', 'teal', 'green', 'yellow', 'orange', 'red'];

function HomePage(props) {
  const [currentPlayer, setCurrentPlayer] = useState(localStorage.getItem('currentPlayer'));
  const [babyUnicorns, setBabyUnicorns] = useState(GroupBy(props.game.cards, 'type')['Baby Unicorn']);
  const [inLobby, setLobby] = useState(0);
  const [username, setUsername] = useState("");
  const [unicorn, setUnicorn] = useState({});

  useEffect(() => {
    // Set current player, if they refreshed the page after creating a player
    if (!props.currentPlayer && currentPlayer) {
      props.setCurrentPlayer(currentPlayer);
    }

    // Set current lobby and remove any unicorns currently in use
    props.socket.on('userConnected', (inLobby, inGame) => {
      const usedUnicorns = Reduce(inGame, (newArr, player) => {
        return [...newArr, player.unicorn.id];
      }, []);
      const babyUnicornsRemaining = []

      for (var i = 0; i < babyUnicorns.length; i++) {
        let unicornIndex = usedUnicorns.findIndex(usedUnicornId => {
          return usedUnicornId === babyUnicorns[i].id
        })

        if (unicornIndex === -1) {
          babyUnicornsRemaining.push(babyUnicorns[i])
        }
      }

      setLobby(inLobby);
      props.setPlayers(inGame)
      setBabyUnicorns(babyUnicornsRemaining);

      // Uncomment to start game on load
      // startGame(props.game.cards, inGame)
    })

    props.socket.on('playerAdded', players => {
      props.setPlayers(players)
    })

    props.socket.on('startingGame', (options, decks, players) => {
      props.startGame(options, decks, players)
    })
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
    props.setCurrentPlayer(newPlayer);
    localStorage.setItem('currentPlayer', newPlayer.id);
    setCurrentPlayer(newPlayer.id);
    props.socket.emit('addPlayer', updatedPlayers);
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

  function startGame(cards = props.game.cards, currentPlayers = props.players) {
    console.log(cards, currentPlayers)
    Remove(cards, c => {
      return c.type === 'Baby Unicorn'
    })

    const [drawPile, updatedPlayers] = deal(Shuffle(cards), currentPlayers)

    props.socket.emit('startGame', {
      whosTurn: currentPlayers[0]
    }, {
      drawPile,
      nursery: babyUnicorns,
      discardPile: []
    },
    updatedPlayers)
  }

  return (
    <div style={{display: props.game.playing ? 'none' : 'block'}}>
    { !currentPlayer ?
      <div>
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
      </div>
      : null }

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


      <p>{inLobby - props.players.length} player(s) left to make characters</p>
      <button onClick={() => { startGame() }}>Start Game</button>
    </div>
  );
}

const mapStateToProps = state => ({
  currentPlayer: state.player,
  players: state.players,
  game: state.game,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    setCurrentPlayer: bindActionCreators(setCurrentPlayer, dispatch),
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
