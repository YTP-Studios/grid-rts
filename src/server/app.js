const express = require('express');
const path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
import ServerGame from './server-game';
import { Command } from '../shared/commands';
import { TEAMS } from '../shared/teams';
import { READY, START, COMMAND, GAME_STATE, RESET } from '../shared/game-events';
import { VS_MAP } from '../shared/constants';
import GameMap from '../shared/game_map';

const port = 8000;

app.use('/static', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

let game = new ServerGame(io);
game.init(GameMap.fromString(VS_MAP));
setInterval(() => {
  game.update(1);
  io.emit(GAME_STATE, game.getState());
}, 1000 / 60);

io.on('connection', (socket) => {
  console.log('a user connected');

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
    game.init(GameMap.fromString(VS_MAP));
  });
});

http.listen(port, () => console.log(`App listening on port: ${port}`));
