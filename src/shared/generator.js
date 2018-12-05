import Building from "./building";
import * as Constants from '../shared/constants';

export default class Generator extends Building {
    constructor(row, col, team) {
        super(row, col, team, Constants.GENERATOR_SIZE, Constants.GENERATOR_HEALTH);
    }

    getIncome() {
        return Constants.GENERATOR_INCOME;
    }

    getEnergyCap() {
        return Constants.GENERATOR_CAP;
    }
      
    reset() {
        super.reset();
        this.health = Constants.GENERATOR_HEALTH;
    }
}
