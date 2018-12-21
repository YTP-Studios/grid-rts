const express = require('express');
const path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
import { Command } from '../shared/commands';
import { TEAMS } from '../shared/teams';
import { READY, START, COMMAND, GAME_STATE, RESET } from '../shared/game-events';
import { VS_MAP } from '../shared/constants';
import GameMap from '../shared/game_map';
import Game from '../shared/game';

const port = 8000;

app.use('/static', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

let game = new Game();
game.init(GameMap.fromString(VS_MAP));
game.players = [];
setInterval(() => {
  game.update(1);
  io.emit(GAME_STATE, game.getState());
}, 1000 / 60);

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  game.players.push(socket);

  socket.on('disconnect', () => {
    game.players = game.players.filter(e => e === socket);
  });

  socket.on(READY, () => {
    socket.emit(START, (game.players.length % (TEAMS.length - 1)) + 1, VS_MAP);
  });

  socket.on(COMMAND, (data) => {
    const command = Command.fromData(data);
    command.exec(game);
  });

  socket.on(RESET, () => {
    console.log('Game reset');
    game.init(GameMap.fromString(VS_MAP));
  });
});

http.listen(port, () => console.log(`App listening on port: ${port}`));
