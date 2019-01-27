import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import { Command } from '../shared/commands';
import { START, COMMAND, GAME_STATE, RESET, JOIN_LOBBY } from '../shared/game-events';
import { VS_MAP } from '../shared/constants';
import GameMap from '../shared/game-map';
import Lobby from './lobby';

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

app.get('/api/lobbies', (req, res) => {
  res.send(lobbies);
});

app.post('/api/lobbies', (req, res) => {
  const lobby = new Lobby(req.body.map);
  lobby.onStartGame = () => io.to(lobby.id).emit(START);
  lobby.onUpdateGame = () => io.to(lobby.id).emit(GAME_STATE, lobby.game.getState());
  lobbies.push(lobby);
  res.send({ id: lobby.id });
});

app.get('/api/lobbies/lobby/:id', (req, res) => {
  res.send(lobbies.find(lobby => lobby.id === req.params.id));
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
    if (lobby) lobby.removePlayer(player);
    lobby = lobbies.find(lobby => lobby.id === id);
    if (lobby) lobby.addPlayer(player);
  });

  socket.on('disconnect', () => {
    if (lobby) {
      lobby.removePlayer(player);
      if (lobby.players.length === 0) {
        lobbies = lobbies.filter(e => e === lobby);
      }
    }
  });

  socket.on(COMMAND, (data) => {
    if (!lobby && lobby.started) return;
    const command = Command.fromData(data);
    if (command.validate(lobby.game, socket.team))
      command.exec(lobby.game);
  });

  socket.on(RESET, () => {
    if (!lobby && lobby.started) return;
    console.log('Game reset');
    lobby.game.init(GameMap.fromString(VS_MAP));
  });
});


http.listen(port, () => console.log(`App listening on port: ${port}`));
