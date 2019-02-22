import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from '../components/Navbar';
import HomeScreen from './Home';
import GameScreen from './Game';
import LobbiesScreen from './Lobbies';
import LobbyScreen from './Lobbies/Lobby';
import Error404Screen from './Error404';

export const Root = () => (<div>
  <BrowserRouter>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/lobbies" component={LobbiesScreen} />
        <Route path="/lobbies/lobby/:id" component={LobbyScreen} />
        <Route path="/game/:id" component={GameScreen} />
        <Route component={Error404Screen} />
      </Switch>
    </div>
  </BrowserRouter>
</div>)

export default Root;
