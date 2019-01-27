import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import { Command } from '../shared/commands';
import { START, COMMAND, GAME_STATE, RESET, JOIN_LOBBY, LEAVE_LOBBY, LOBBY_STATE, START_GAME, READY } from '../shared/game-events';
import { VS_MAP } from '../shared/constants';
import GameMap from '../shared/game-map';
import Lobby from './lobby';
import { TEAMS } from '../shared/teams';

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

const port = 8000;

app.use(bodyParser.json());

app.use('/static', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.js'));
});

let lobbies: Lobby[] = [];
let clearEmpty = () => { lobbies = lobbies.filter(e => e.players.length !== 0); };

app.get('/api/lobbies', (req, res) => {
  res.send(lobbies.map(({ id, name, map, players }) => ({
    id,
    name,
    map,
    players,
    maxPlayers: 4,
  })));
});

app.post('/api/lobbies', (req, res) => {
  const lobby = new Lobby(GameMap.fromString(req.body.map));
  lobby.onStartGame = () => io.to(lobby.id).emit(START);
  lobby.onUpdateGame = () => io.to(lobby.id).emit(GAME_STATE, lobby.game.getState());
  lobbies.push(lobby);
  res.send({ id: lobby.id });
});

app.get('/api/lobbies/:id', (req, res) => {
  const lobby = lobbies.find(lobby => lobby.id === req.params.id);
  if (!lobby) return res.status(404).send();
  res.send(lobby.toJSON());
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  let player = {
    id: socket.id,
    username: socket.id,
  };
  let lobby: Lobby = null;

  socket.on(JOIN_LOBBY, (id) => {
    if (lobby) {
      lobby.removePlayer(player);
      socket.leave(lobby.id);
      io.to(lobby.id).emit(LOBBY_STATE, lobby);
      clearEmpty();
    }
    lobby = lobbies.find(lobby => lobby.id === id);
    if (lobby) {
      lobby.addPlayer(player, (lobby.players.length % (TEAMS.length - 1)) + 1);
      socket.join(lobby.id);
      io.to(lobby.id).emit(LOBBY_STATE, lobby);
    }
  });

  socket.on(LEAVE_LOBBY, (id) => {
    if (lobby) {
      lobby.removePlayer(player);
      socket.leave(lobby.id);
      clearEmpty();
      io.to(lobby.id).emit(LOBBY_STATE, lobby);
    }
    lobby = null;
  });

  socket.on(START_GAME, () => {
    if (!lobby) return console.error('no lobby');
    lobby.started = true;
    io.to(lobby.id).emit(START_GAME, lobby.id);
  });

  socket.on('disconnect', () => {
    if (lobby) {
      lobby.removePlayer(player);
      clearEmpty();
    }
  });

  socket.on(READY, (cb) => {
    if (!lobby || !lobby.started) return;
    player.ready = true;
    cb(lobby.map.toString(), player.team);
    if (lobby.players.every(e => e.ready)) {
      lobby.startGame();
    }
  });

  socket.on(COMMAND, (data) => {
    if (!lobby || !lobby.started) return;
    const command = Command.fromData(data);
    if (command.validate(lobby.game, player.team))
      command.exec(lobby.game);
  });

  socket.on(RESET, () => {
    if (!lobby || !lobby.started) return;
    console.log('Game reset');
    lobby.game.init(GameMap.fromString(VS_MAP));
  });
});


http.listen(port, () => console.log(`App listening on port: ${port}`));
