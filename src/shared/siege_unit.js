import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';
import Unit from './unit';

export default class SiegeUnit extends Unit {

  constructor(x = 0, y = 0, team = NEUTRAL) {
    super(x, y, team, Constants.SIEGE_UNIT_BODY_SIZE, Constants.SIEGE_UNIT_HEALTH, Constants.SIEGE_UNIT_RANGE,
      Constants.SIEGE_UNIT_SPEED, Constants.SIEGE_UNIT_MAX_TARGETS);
    this.elapsedTime = 0;
    this.foundTarget = false;
    this.aoePos = { x: 0, y: 0 };
  }

  canAttackUnit(unit) {
    let dist = Vectors.dist(this, unit);
    return this.team !== unit.team && dist < this.range && unit.team !== NEUTRAL && !this.isAttacking;
  }

  attack(enemies, delta) {
    this.nearestEnemy = super.findNearestEnemy(enemies);
    if (!this.foundTarget) {
      this.aoePos = { x: this.nearestEnemy.x, y: this.nearestEnemy.y };
      this.foundTarget = true;
    }
    this.elapsedTime += delta;
    if (this.elapsedTime >= Constants.SIEGE_UNIT_COOLDOWN) {
      for (let i = 0; i < enemies.length; i++) {
        if (this.isInAoeField(this.aoePos, enemies[i]))
          enemies[i].health -= Constants.SIEGE_UNIT_DAMAGE;
      }
      this.foundTarget = false;
      this.elapsedTime = 0;
    }
  }

  isInAoeField(aoeFieldLocation, nearestEnemy) {
    const combinedSize = Constants.SIEGE_UNIT_EXPLOSION_RADIUS + nearestEnemy.size;
    const dist = Vectors.dist(aoeFieldLocation, nearestEnemy);
    return dist <= combinedSize;
  }

  getState() {
    let state = super.getState();
    state.type = 'unit:siege_unit';
    return state;
  }
}
