import Building from './building';
import * as Constants from '../shared/constants';

export default class Conduit extends Building {
  constructor(row, col, team) {
    super(row, col, team, Constants.CONDUIT_SIZE, Constants.CONDUIT_HEALTH);
    this.energyCap = Constants.CONDUIT_CAP;
    this.maxHealth = Constants.CONDUIT_HEALTH;
    this.captureTime = Constants.CONDUIT_CAPTURE_TIME;
  }
}
