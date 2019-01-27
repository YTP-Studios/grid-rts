import * as React from 'react';
import { READY, START } from '../../../shared/game-events';
import ClientGame from '../../game/client-game';
import { withSocket } from './Socket';

class Game extends React.Component<any, any> {
  private containerRef: any;
  private game: ClientGame;
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }
  componentDidMount = () => {
    const { socket } = this.props;
    this.game = new ClientGame(this.containerRef.current);
    socket.emit(READY, (mapData, team) => {
      this.game.init(socket, mapData, team);
    });
    socket.on(START, () => {
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
    const { socket } = this.props;
    this.game.destroy();
    socket.off(START);
  }
}

export default withSocket(Game)
