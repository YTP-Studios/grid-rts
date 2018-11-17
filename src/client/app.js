import ClientGame from './client_game';
import io from 'socket.io-client';

const socket = io();

ClientGame.loadAssets().then(() => {
    let game = new ClientGame();
    game.init(socket);
    game.start();
})
