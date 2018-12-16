import Building from './building';
import * as Constants from '../shared/constants';

export default class Generator extends Building {
  constructor(row, col, team) {
    super(row, col, team, Constants.GENERATOR_SIZE, Constants.GENERATOR_HEALTH);
    this.powered = true;
  }

  checkPowered(map) {
    this.powered = true;
    super.checkPowered(map);
  }

  getIncome() {
    return Constants.GENERATOR_INCOME;
  }

  getEnergyCap() {
    return Constants.GENERATOR_CAP;
  }

  getMaxHealth() {
    return Constants.GENERATOR_HEALTH;
  }

  getCaptureTime() {
    return Constants.GENERATOR_CAPTURE_TIME;
  }

}
