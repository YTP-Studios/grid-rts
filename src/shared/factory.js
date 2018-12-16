import Building from './building';
import * as Constants from '../shared/constants';

export default class Factory extends Building {
  constructor(row, col, team) {
    super(row, col, team, Constants.FACTORY_SIZE, Constants.FACTORY_HEALTH);
  }

  getIncome() {
    return 0;
  }

  getEnergyCap() {
    return 0;
  }
  getMaxHealth() {
    return Constants.FACTORY_HEALTH;
  }

  getCaptureTime() {
    return Constants.FACTORY_CAPTURE_TIME;
  }
}
