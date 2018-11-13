import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';
import Unit from './unit';

export default class BasicUnit extends Unit {

    constructor(x = 0, y = 0, size = Constants.BASIC_UNIT_BODY_SIZE, team = NEUTRAL,
        health = Constants.BASIC_UNIT_HEALTH, range = Constants.BASIC_UNIT_RANGE, speed = Constants.BASIC_UNIT_SPEED) {
            super(x, y, size, team, health, range, speed);
    }

    update(delta) {
        super.update(delta);
    }

    attack(nearestEnemy) {
        this.nearestEnemy = nearestEnemy;
        this.nearestEnemy.health -= Constants.LASER_DAMAGE;
    }
}
