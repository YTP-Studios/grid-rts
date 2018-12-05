import Building from "./building";
import * as Constants from '../shared/constants';

export default class Conduit extends Building {
    constructor(row, col, team) {
        super(row, col, team, Constants.CONDUIT_SIZE, Constants.CONDUIT_HEALTH);
    }

    getIncome() {
        return 0;
    }

    getEnergyCap() {
        return Constants.CONDUIT_CAP;
    }
}
