import Building from './building';
import * as Constants from '../shared/constants';

export default class Factory extends Building {
  constructor(row, col, team) {
    super(row, col, team, Constants.FACTORY_SIZE, Constants.FACTORY_HEALTH);
    this.maxHealth = Constants.FACTORY_HEALTH;
    this.captureTime = Constants.FACTORY_CAPTURE_TIME;
  }
}
