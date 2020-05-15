import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './LobbyPage.css';
import { setCurrentPlayer, setPlayers, startGame, joinLobby, leaveLobby } from 'actions';
import { useHistory, useParams } from "react-router-dom";
import { useCurrentPlayerIndex } from 'utils/hooks.js';
import GroupBy from 'lodash/groupBy';
import Remove  from 'lodash/remove';
import Shuffle  from 'lodash/shuffle';
import Reduce  from 'lodash/reduce';
import { Dropdown, Image, Item, Segment, Button, Input } from 'semantic-ui-react';
const colors = ['purple', 'blue', 'teal', 'green', 'yellow', 'orange', 'red'];

function LobbyPage(props) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(localStorage.getItem('currentPlayerIndex'));
  const [babyUnicorns, setBabyUnicorns] = useState(GroupBy(props.game.cards, 'type')['Baby Unicorn']);
  const [inLobby, setLobby] = useState(0);
  const [username, setUsername] = useState("");
  const [unicorn, setUnicorn] = useState({});
  const history = useHistory();
  const urlParams = useParams().id;
  // console.log('rendered lobby');

  useEffect(() => {
    console.log(props.game.roomId)
    console.log(currentPlayerIndex);
    if (currentPlayerIndex) {
      console.log('called')
      props.setCurrentPlayer(currentPlayerIndex);
    }

    if (!props.game.roomId) {
      console.log('checking for roomid');
      props.socket.on('reconnect', (lobby, gameState) => {
        console.log('found lobby')
        console.log(lobby, gameState)
        if (gameState) {
          console.log(gameState)
          const inGame = gameState.currentPlayers;
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

          props.joinLobby(lobby)
          setLobby(inLobby);
          console.log(inGame)
          props.setPlayers(inGame)
          setBabyUnicorns(babyUnicornsRemaining);
        } else {
          history.push('/')
        }

        //TODO: may need to remove this
        props.socket.removeListener('reconnect');
      })
      props.socket.emit('checkForRoom', urlParams)
    }

    // Set current lobby and remove any unicorns currently in use
    props.socket.on('userConnected', (inLobby, inGame) => {
      console.log('users connected')
      console.log('ingame', inLobby, inGame)
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
    })

    props.socket.on('playerAdded', players => {
      console.log('player added')
      const usedUnicorns = Reduce(players, (newArr, player) => {
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
      props.setPlayers(players)
      setBabyUnicorns(babyUnicornsRemaining);
    })

    props.socket.on('startingGame', (options, decks, players) => {
      console.log(options);
      props.startGame(options, decks, players, currentPlayerIndex === '0')
      history.push(`/${urlParams}/game`);
    })

    return () => {
      props.socket.removeListener('userConnected');
      props.socket.removeListener('reconnect');
      props.socket.removeListener('playerAdded');
      props.socket.removeListener('startingGame');
    };
  }, [props.socket]);

  function leaveLobby() {
    props.socket.emit('leaveLobby', urlParams)
    props.leaveLobby()
    history.push(`/`)
  }

  function addPlayer() {
    const newPlayer = {
      id: props.players.length + 1,
      connected: true,
      color: colors[props.players.length + 1],
      name: username,
      unicorn,
      hand: [],
      stable: [unicorn],
      upgrades: [],
      downgrades: [],
      playingCard: false
    };
    const updatedPlayers = [...props.players, newPlayer]

    let unicornsLeft = babyUnicorns.splice(unicorn.index, 1);
    setBabyUnicorns(babyUnicorns);
    setUsername("")
    setUnicorn({})
    props.setCurrentPlayer(props.players.length);
    localStorage.setItem('currentPlayerIndex', props.players.length);
    setCurrentPlayerIndex(props.players.length);
    props.socket.emit('addPlayer', urlParams, updatedPlayers);
  }

  function selectUnicorn(unicorn, index) {
    //TODO: update players so 2 players can't set the same unicorn
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
    Remove(cards, c => {
      return c.type === 'Baby Unicorn'
    })

    const [drawPile, updatedPlayers] = deal(Shuffle(cards), currentPlayers)

    props.socket.emit('startGame', urlParams, {
      ...props.game,
      whosTurn: currentPlayers[0]
    }, {
      drawPile,
      nursery: babyUnicorns,
      discardPile: []
    },
    updatedPlayers)
  }

  return (
    <div>
    { currentPlayerIndex === null ?
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
          <Dropdown.Item onClick={() => { selectUnicorn(option, i)}} key={option.id} text={option.name} image={option.url}  />
        ))}
      </Dropdown.Menu>
    </Dropdown>
      {unicorn.id ? <Image src={unicorn.url} avatar /> : null }
      Add Player: <Input value={username} id="addUserText" onChange={(e) => setUsername(e.target.value)} /> <Button onClick={addPlayer}>Add</Button>
      </div>
      : null }

      <h2>Players</h2>
      <Item.Group style={{display: 'flex'}}>
        {props.players.map(player => {
          return (
            <Segment key={player.id} inverted color={player.color}>
              <Item>
                <Item.Image size='tiny' src={player.unicorn.url} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header>{player.name}</Item.Header>
                </Item.Content>
              </Item>
            </Segment>
          )
        })}
      </Item.Group>


      <p>{inLobby - props.players.length} player(s) left to make characters</p>
      <Button onClick={leaveLobby}  color="blue" size="massive">Leave Lobby</Button>
      <Button onClick={() => { startGame() }}  color="blue" size="massive">Start Game</Button>
    </div>
  );
}

const mapStateToProps = state => ({
  players: state.players,
  game: state.game,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
    setCurrentPlayer: bindActionCreators(setCurrentPlayer, dispatch),
    setPlayers: bindActionCreators(setPlayers, dispatch),
    startGame: bindActionCreators(startGame, dispatch),
    joinLobby: bindActionCreators(joinLobby, dispatch),
    leaveLobby: bindActionCreators(leaveLobby, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LobbyPage)
