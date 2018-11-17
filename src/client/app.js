import ClientGame from './client_game';
import io from 'socket.io-client';
import { READY, START } from '../shared/game-events';

const socket = io();

ClientGame.loadAssets().then(() => {
    let game = new ClientGame();
    game.init(socket);
    socket.emit(READY);
    socket.on(START, (team) => {
        game.playerTeam = team;
        game.start();
    });
})
