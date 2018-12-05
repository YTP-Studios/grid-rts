import ClientGame from './client_game';
import io from 'socket.io-client';
import { READY, START } from '../shared/game-events';
const socket = io();

ClientGame.loadAssets().then(() => {
    let game = new ClientGame();
    socket.emit(READY);
    socket.on(START, (team, mapData) => {
        game.init(socket, mapData);
        game.playerTeam = team;
        game.start();
        window.game = game; // for debugging
    });
})
