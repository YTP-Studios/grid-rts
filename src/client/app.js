import ClientGame from './client_game';

ClientGame.loadAssets().then(() => {
    let game = new ClientGame();
    game.init();
    game.start();
})
