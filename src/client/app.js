import ClientGame from './client_game';

let game = new ClientGame();

game.load().then(() => {
    game.init();
    game.start();
})
