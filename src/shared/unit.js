import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';

export default class Unit {

    constructor(x = 0, y = 0, size = 0, team = Constants.NEUTRAL, color = Constants.NEUTRAL_COLOR) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetPos = { x, y };
        this.nearestEnemy = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.team = team;
        this.color = color;
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
    }

    stopAttacking() {
        this.isAttacking = false;
    }
}
