import Building from "./building";
import * as Constants from '../shared/constants';

export default class Factory extends Building {
    constructor(row, col, team) {
        super(row, col, team, Constants.FACTORY_SIZE, Constants.FACTORY_HEALTH);
    }

    reset() {
        super.reset();
        this.health = Constants.FACTORY_HEALTH;
    }
}
