import * as Vectors from './vectors';
import * as Constants from './constants';
import { NEUTRAL } from './teams';
import Unit from './unit';

export default class BasicUnit extends Unit {

  constructor(x = 0, y = 0, team = NEUTRAL) {
    super(x, y, team, Constants.BASIC_UNIT_BODY_SIZE, Constants.BASIC_UNIT_HEALTH, Constants.BASIC_UNIT_RANGE,
      Constants.BASIC_UNIT_SPEED, Constants.BASIC_UNIT_MAX_TARGETS);
  }

  attack(enemies) {
    this.nearestEnemy = this.findNearestEnemy(enemies);
    this.nearestEnemy.health -= Constants.LASER_DAMAGE;
  }

  canAttackUnit(unit) {
    let dist = Vectors.dist(this, unit);
    return this.team !== unit.team && dist < this.range && unit.team !== NEUTRAL;
  }

  getState() {
    let state = super.getState();
    state.type = 'unit:basic_unit';
    return state;
  }
}
