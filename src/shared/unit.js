import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';

export default class Unit {

    constructor(x = 0, y = 0, size = 0, team = NEUTRAL,
        health = Constants.UNIT_HEALTH, range = Constants.UNIT_RANGE, 
        speed = Constants.UNIT_SPEED, enabled = true) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetPos = { x, y };
        this.nearestEnemy = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.team = team;
        this.health = health;
        this.range = range;
        this.speed = speed;
        this.enabled = enabled;
    }

    update(delta) {
        if (!this.atDestination()) {
            const displacement = Vectors.difference(this.targetPos, this)
            this.velocity = Vectors.scaleTo(displacement, this.speed);

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
        return this.team != unit.team && dist < this.range;
    }

    stopAttacking() {
        this.isAttacking = false;
    }
}
