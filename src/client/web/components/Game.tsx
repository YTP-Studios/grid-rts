import * as React from 'react';
import * as io from 'socket.io-client';
import { READY, START } from '../../../shared/game-events';
import ClientGame from '../../game/client-game';

export default class Game extends React.Component {
  private containerRef: any;
  private game: ClientGame;
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }
  componentDidMount = () => {
    const socket = io();
    this.game = new ClientGame(this.containerRef.current);
    socket.emit(READY);
    socket.on(START, (team, mapData) => {
      this.game.init(socket, mapData, team);
      this.game.start();
      (window as any).game = this.game; // for debugging
    });
  }
  render() {
    return (<div className='game-container'>
      <div ref={this.containerRef}>

      </div>
    </div>)
  }
  componentWillUnmount() {
    this.game.destroy();
  }
}
