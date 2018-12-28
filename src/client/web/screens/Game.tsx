import * as React from 'react';
import ClientGame from '../../game/client-game';
import * as io from 'socket.io-client';
import { READY, START } from '../../../shared/game-events';

import './Game.css';

export default class GameScreen extends React.Component {
    private containerRef: any;
    state = {
        loading: true,
    };
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        ClientGame.loadAssets().then(() => {
            this.setState({ loading: false });
        });

    }
    componentDidUpdate = () => {
        if (!this.state.loading) {
            const socket = io();
            let game = new ClientGame(this.containerRef.current);
            socket.emit(READY);
            socket.on(START, (team, mapData) => {
                game.init(socket, mapData, team);
                game.start();
                (window as any).game = game; // for debugging
            });
        }
    }
    render() {
        return (<div className='game-container'>
            <div ref={this.containerRef}>

            </div>
        </div>)
    }

}
