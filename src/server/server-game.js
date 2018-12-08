import Game from '../shared/game';
import BasicUnit from '../shared/basic_unit';
import SiegeUnit from '../shared/siege_unit';
import { BLUE_TEAM, RED_TEAM } from '../shared/teams';

export default class ServerGame extends Game {
  constructor() {
    super();
    this.players = [];
  }

  init(map) {
    super.init(map, [
      new BasicUnit(0, 500, RED_TEAM),
      new BasicUnit(0, 450, RED_TEAM),
      new BasicUnit(0, 400, RED_TEAM),
      new BasicUnit(0, 350, RED_TEAM),
      new BasicUnit(50, 500, RED_TEAM),
      new SiegeUnit(500, 0, BLUE_TEAM),
      new SiegeUnit(550, 0, BLUE_TEAM),
      new SiegeUnit(650, 0, BLUE_TEAM),
      new BasicUnit(450, 0, BLUE_TEAM),
      new BasicUnit(500, 50, BLUE_TEAM),
    ]);
  }

  update(delta) {
    super.update(delta);
  }
}
