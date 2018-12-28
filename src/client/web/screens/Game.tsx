import * as React from 'react';
import ClientGame from '../../game/client-game';

import './Game.css';
import Game from '../components/Game';

export default class GameScreen extends React.Component<{}, { loaded: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            loaded: ClientGame.assetsLoaded
        }
        if (!ClientGame.assetsLoaded) {
            ClientGame.loadAssets().then(() => {
                this.setState({ loaded: true });
            })
        }
    }

    render = () => (<div>
        {this.state.loaded && <Game />}
    </div>)
}
