import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomeScreen from './Home';
import GameScreen from './Game';
import Error404Screen from './Error404';
import Navbar from '../components/Navbar';
import LobbiesScreen from './Lobbies';

export const Root = () => (<div>
  <BrowserRouter>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route path="/lobbies" component={LobbiesScreen} />
        <Route path="/test" component={GameScreen} />
        <Route component={Error404Screen} />
      </Switch>
    </div>
  </BrowserRouter>
</div>)

export default Root;
