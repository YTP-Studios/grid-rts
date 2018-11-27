import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';
import Unit from './unit';

export default class SiegeUnit extends Unit {

    constructor(x = 0, y = 0, team = NEUTRAL) {
        super(x, y, team, Constants.SIEGE_UNIT_BODY_SIZE, Constants.SIEGE_UNIT_HEALTH, Constants.SIEGE_UNIT_RANGE, Constants.SIEGE_UNIT_SPEED);
    }

    canAttackUnit(unit) {
        let dist = Vectors.dist(this, unit);
        return this.team != unit.team && dist < this.range && unit.team != NEUTRAL && !this.isAttacking;
    }

    attack(nearestEnemy) {
        this.nearestEnemy = nearestEnemy;
        this.nearestEnemy.health -= 1;
    }

    getState() {
        let state = super.getState();
        state.type = "unit:siege_unit";
        return state;
    }
}
