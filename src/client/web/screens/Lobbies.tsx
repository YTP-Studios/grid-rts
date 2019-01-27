import * as React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Table, Input } from 'reactstrap';
import { VS_MAP } from '../../../shared/constants';
import { withRouter } from 'react-router';

class LobbiesScreen extends React.Component<any, any> {
  state: {
    lobbies: any[],
  };

  constructor(props) {
    super(props);
    this.state = {
      lobbies: [],
    }
  }

  componentWillMount() {
    this.getLobbies();
  }

  async getLobbies() {
    const response = await fetch("/api/lobbies");
    this.setState({ lobbies: await response.json() });
  }

  createLobby = async () => {
    const request = {
      method: 'POST',
      body: JSON.stringify({ map: VS_MAP }),
    }
    const response = await fetch('/api/lobbies', request);
    this.props.history.push(`/lobbies/lobby/${(await response.json()).id}`)
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
              <Button block onClick={this.createLobby}>Create</Button>
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
                {this.state.lobbies.map((lobby, i) => <tr key={i} style={{ cursor: 'pointer' }}>
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
              Players:
                <ul style={{ listStyle: 'none' }}>
                <li>Player 1</li>
                <li>Player 2</li>
              </ul>
              <Button className="float-right">Join</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>)
  }
}

export default withRouter(LobbiesScreen)
