import Building from "./building";
import * as Constants from '../shared/constants';

export default class Generator extends Building {
    constructor(row, col, team) {
        super(row, col, team, Constants.GENERATOR_SIZE, Constants.GENERATOR_HEALTH);
    }
}
