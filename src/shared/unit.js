import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';
import * as uuid from 'uuid/v4';

export default class Unit {

    constructor(x = 0, y = 0, team = NEUTRAL, size = 0, health, range, speed, enabled = true) {
        this.id = uuid();
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

    destroy() { }

    getState() {
        return {
            type: "unit",
            id: this.id,
            x: this.x,
            y: this.y,
            team: this.team,
            health: this.health,
            enabled: this.enabled,
            targetPos: { ...this.targetPos },
        };
    }

    setState({ x, y, team, health, enabled, targetPos }) {
        this.x = Number(x);
        this.y = Number(y);
        this.team = Number(team);
        this.health = Number(health);
        this.enabled = enabled;
        this.targetPos.x = Number(targetPos.x);
        this.targetPos.y = Number(targetPos.y);
    }
}
