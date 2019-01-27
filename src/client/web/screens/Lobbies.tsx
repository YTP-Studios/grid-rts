import * as React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Table, Input } from 'reactstrap';
import { VS_MAP } from '../../../shared/constants';
import { withRouter } from 'react-router';

class LobbiesScreen extends React.Component<any, any> {
  state: {
    lobbies: any[],
    selectedLobby?: any;
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
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ map: VS_MAP }),
    }
    const response = await fetch('/api/lobbies', request);
    this.props.history.push(`/lobbies/lobby/${(await response.json()).id}`)
  }

  joinLobby = ({ id }) => {
    this.props.history.push(`/lobbies/lobby/${id}`)
  }

  render() {
    const { lobbies, selectedLobby } = this.state;
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
                {lobbies.map((lobby, i) =>
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => this.setState({ selectedLobby: lobby })}>
                    <td>
                      {lobby.name}
                    </td>
                    <td>
                      {lobby.mapName}
                    </td>
                    <td>
                      {lobby.players.length}/{lobby.maxPlayers}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </div>
        <div className="col-4">
          {selectedLobby && <Card>
            <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Preview&w=320&h=240" alt="Play now" />
            <CardBody>
              <CardTitle>{selectedLobby.name}</CardTitle>
              Players:
                <ul style={{ listStyle: 'none' }}>
                {selectedLobby.players.map((player, i) => <li key={i}>{player.id}</li>)}
              </ul>
              <Button className="float-right" onClick={() => this.joinLobby(selectedLobby)}>Join</Button>
            </CardBody>
          </Card>}
        </div>
      </div>
    </div>)
  }
}

export default withRouter(LobbiesScreen)
