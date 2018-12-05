import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';
import Unit from './unit';

export default class SiegeUnit extends Unit {

    constructor(x = 0, y = 0, team = NEUTRAL) {
        super(x, y, team, Constants.SIEGE_UNIT_BODY_SIZE, Constants.SIEGE_UNIT_HEALTH, Constants.SIEGE_UNIT_RANGE,
            Constants.SIEGE_UNIT_SPEED, Constants.SIEGE_UNIT_MAX_TARGETS);
    }

    canAttackUnit(unit) {
        let dist = Vectors.dist(this, unit);
        return this.team != unit.team && dist < this.range && unit.team != NEUTRAL && !this.isAttacking;
    }

    attack(enemies) {
        this.nearestEnemy = super.findNearestEnemy(enemies);
        this.isOnCooldown = true;
        let curEnemyLocation = { x: this.nearestEnemy.x, y: this.nearestEnemy.y }
        setTimeout(() => {
            this.isOnCooldown = false;
            for (let i = 0; i < enemies.length; i ++) {
                if (this.isInAoeField(curEnemyLocation, enemies[i]))
                    enemies[i].health -= Constants.SIEGE_UNIT_DAMAGE;
            }
        }, Constants.SIEGE_UNIT_COOLDOWN);
    }

    isInAoeField(aoeFieldLocation, nearestEnemy) {
        const combinedSize = Constants.SIEGE_UNIT_EXPLOSION_RADIUS + nearestEnemy.size;
        const dist = Vectors.dist(aoeFieldLocation, nearestEnemy);
        return dist <= combinedSize;
    }

    getState() {
        let state = super.getState();
        state.type = "unit:siege_unit";
        return state;
    }
}
