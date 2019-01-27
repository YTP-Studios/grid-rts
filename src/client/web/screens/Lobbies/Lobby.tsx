import * as React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Table } from 'reactstrap';
import { withRouter } from 'react-router';
import { withSocket } from '../../components/Socket';
import { JOIN_LOBBY, LEAVE_LOBBY, LOBBY_STATE, START_GAME, START } from '../../../../shared/game-events';

class LobbyScreen extends React.Component<any, any> {
  state: {
    dropdownOpen: string,
    lobby: any,
  };

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: null,
      lobby: {
        name: "Lobby 1",
        map: {
          name: "Map name",
        },
        players: [],
        maxPlayers: 4,
      },
    }
  }

  async componentWillMount() {
    const { match, history, socket } = this.props;
    const response = await fetch(`/api/lobbies/${match.params.id}`);
    if (response.status === 404) {
      console.error("Lobby not found");
      return history.replace("/lobbies");
    }
    this.setState({ lobby: await response.json() });
    socket.emit(JOIN_LOBBY, match.params.id);
    socket.on(LOBBY_STATE, (lobby) => {
      this.setState({ lobby });
    })
    socket.on(START_GAME, (id) => {
      history.push(`/game/${id}`);
    })
  }

  async componentWillUnmount() {
    const { socket } = this.props;
    socket.off(LOBBY_STATE);
    socket.off(START_GAME);
  }

  leaveLobby = () => {
    const { history, socket } = this.props;
    socket.emit(LEAVE_LOBBY);
    history.push('/lobbies');
  }

  startGame = () => {
    const { socket } = this.props;
    socket.emit(START_GAME);
  }

  renderPlayer = (player) => {
    return <tr key={player.id} style={{ cursor: 'pointer' }}>
      <td>
        {player.team}
      </td>
      <td>
        {player.id}
      </td>
      <td>

      </td>
    </tr>
  }

  render() {
    const { lobby } = this.state;
    return (<div className="container pt-3">
      <h1>{lobby.name}</h1>

      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col-4">
              <Button block onClick={this.leaveLobby}>Leave Lobby</Button>
            </div>
          </div>
          <Table responsive style={{ margin: '-1px 0 0' }}>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>
                  Team
                </th>
                <th>
                  Player
                </th>
              </tr>
            </thead>
            <tbody>
              {lobby.players.map(this.renderPlayer)}
            </tbody>
          </Table>
        </div>
        <div className="col-4">
          <Card>
            <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Preview&w=320&h=240" alt="Play now" />
            <CardBody>
              <CardTitle>{lobby.map.name}</CardTitle>
              <CardText>
                Details
              </CardText>
              <Button size="lg" block onClick={this.startGame}>Start Game</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>)
  }
}

export default withSocket(withRouter(LobbyScreen))
