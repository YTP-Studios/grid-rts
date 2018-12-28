import * as React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Table, Input } from 'reactstrap';

export default class LobbiesScreen extends React.Component {
  state: {
    lobbies: any[],
  };

  constructor(props) {
    super(props);
    this.state = {
      lobbies: [
        {
          name: "Lobby 1",
          mapName: "Map name",
          players: ["Player 1", "Player 2"],
          maxPlayers: 4,
        },
        {
          name: "Lobby 2",
          mapName: "Map name",
          players: ["Player 3", "Player 4"],
          maxPlayers: 2,
        },
        {
          name: "Lobby 3",
          mapName: "Map name",
          players: ["Player 5", "Player 6", "Player 7"],
          maxPlayers: 4,
        },
      ],
    }
  }

  render() {
    return (<div className="container pt-3">
      <h1>Lobbies</h1>

      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col-8">
              <Input placeholder="Search Lobbies..."></Input>
            </div>
            <div className="col-4">
              <Button block>Create</Button>
            </div>
          </div>
          <Card className="mt-3">
            <Table responsive hover style={{ margin: '-1px 0 0' }}>
              <thead>
                <tr>
                  <th>
                    Lobby Name
                  </th>
                  <th>
                    Map
                  </th>
                  <th>
                    Players
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.lobbies.map(lobby => <tr style={{ cursor: 'pointer' }}>
                  <td>
                    {lobby.name}
                  </td>
                  <td>
                    {lobby.mapName}
                  </td>
                  <td>
                    {lobby.players.length}/{lobby.maxPlayers}
                  </td>
                </tr>)}
              </tbody>
            </Table>
          </Card>
        </div>
        <div className="col-4">
          <Card>
            <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Preview&w=320&h=240" alt="Play now" />
            <CardBody>
              <CardTitle>Lobby Name</CardTitle>
              <CardText>
                Players:
                <ul style={{ listStyle: 'none' }}>
                  <li>Player 1</li>
                  <li>Player 2</li>
                </ul>
              </CardText>
              <Button className="float-right">Join</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>)
  }
}
