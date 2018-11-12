import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';

export default class Unit {

    constructor(x = 0, y = 0, size = 0, team = NEUTRAL,
        health = Constants.UNIT_HEALTH, enabled = true) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetPos = { x, y };
        this.nearestEnemy = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.team = team;
        this.health = health;
        this.enabled = enabled;
    }

    update(delta) {
        if (!this.atDestination()) {
            const displacement = Vectors.difference(this.targetPos, this)
            this.velocity = Vectors.scaleTo(displacement, Constants.UNIT_SPEED);

            this.x += this.velocity.x * delta;
            this.y += this.velocity.y * delta;
        } else {
            Vectors.copyTo(this, this.targetPos);
        }
        if (this.health < 0) {
            this.enabled = false;
        }
    }

    atDestination() {
        return Vectors.dist(this, this.targetPos) <= this.size;
    }

    canAttackUnit(unit) {
        let dist = Vectors.dist(this, unit);
        return this.team != unit.team && dist < Constants.UNIT_RANGE;
    }

    attack(nearestEnemy) {
        this.nearestEnemy = nearestEnemy;
        this.nearestEnemy.health -= Constants.LASER_DAMAGE;
    }

    stopAttacking() {
        this.isAttacking = false;
    }
}
