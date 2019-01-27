import * as React from 'react';
import * as io from 'socket.io-client';
import { READY, START } from '../../../shared/game-events';
import ClientGame from '../../game/client-game';

export default class Game extends React.Component<any, any> {
  private containerRef: any;
  private game: ClientGame;
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }
  componentDidMount = () => {
    this.game = new ClientGame(this.containerRef.current);
    const socket = io(this.props.id);
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
