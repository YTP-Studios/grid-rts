import Building from './building';
import * as Constants from '../shared/constants';

export default class Generator extends Building {
  constructor(row, col, team) {
    super(row, col, team, Constants.GENERATOR_SIZE, Constants.GENERATOR_HEALTH);
    this.powered = true;
    this.income = Constants.GENERATOR_INCOME;
    this.energyCap = Constants.GENERATOR_CAP;
    this.maxHealth = Constants.GENERATOR_HEALTH;
    this.captureTime = Constants.GENERATOR_CAPTURE_TIME;
  }

  checkPowered(map) {
    this.powered = true;
    super.checkPowered(map);
  }
}
