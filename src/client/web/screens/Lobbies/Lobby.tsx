import * as React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Table } from 'reactstrap';

export default class LobbyScreen extends React.Component {
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
        players: [
          {
            id: "1",
            name: "Player 1",
            team: 1,
          },
          {
            id: "2",
            name: "Player 2",
            team: 2,
          },
          {
            id: "3",
            name: "Player 3",
            team: 2,
          },
          {
            id: "4",
            name: "Player 4",
            team: 2,
          },
        ],
        maxPlayers: 4,
      },
    }
  }

  renderPlayer = (player) => {
    return <tr key={player.id} style={{ cursor: 'pointer' }}>
      <td>
        {player.team}
      </td>
      <td>
        {player.name}
      </td>
      <td>

      </td>
    </tr>
  }

  render() {
    return (<div className="container pt-3">
      <h1>Lobbies</h1>

      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col-4">
              <Button block>Leave Lobby</Button>
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
              {this.state.lobby.players.map(this.renderPlayer)}
            </tbody>
          </Table>
        </div>
        <div className="col-4">
          <Card>
            <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Preview&w=320&h=240" alt="Play now" />
            <CardBody>
              <CardTitle>{this.state.lobby.map.name}</CardTitle>
              <CardText>
                Details
              </CardText>
              <Button size="lg" block>Start Game</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>)
  }
}
