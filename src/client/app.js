import ClientGame from './client_game';
import io from 'socket.io-client';
import { READY, START, MAPDATA } from '../shared/game-events';
import GameMap from '../shared/game_map';
import { DEFAULT_MAP } from '../shared/constants';
import ClientMap from './client_map';

const socket = io();

ClientGame.loadAssets().then(() => {
    let game = new ClientGame();
    socket.emit(READY);
    socket.on(START, (team, mapData) => {
        game.init(socket, mapData);
        game.playerTeam = team;
        game.start();
    });
})
