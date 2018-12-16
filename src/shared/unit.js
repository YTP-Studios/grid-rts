import { Vector, difference, scaleTo, copyTo, dist } from '../shared/vectors';
import { NEUTRAL } from './teams';
import { Entity } from './entity';

import * as uuid from 'uuid/v4';

export default class Unit implements Entity {
  targetPos: Vector;
  nearestEnemy: Vector;
  velocity: Vector;
  range: number;
  speed: number;

  constructor(x = 0, y = 0, team = NEUTRAL, size = 0, health, range, speed, maxTargets) {
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
    this.enabled = true;
    this.isOnCooldown = false;
    this.maxTargets = maxTargets;
  }

  update(delta) {
    if (!this.atDestination()) {
      const displacement = difference(this.targetPos, this);
      this.velocity = scaleTo(displacement, this.speed);

      this.x += this.velocity.x * delta;
      this.y += this.velocity.y * delta;
    } else {
      copyTo(this, this.targetPos);
    }
    if (this.health < 0) {
      this.enabled = false;
    }
  }

  findNearestEnemy(enemiesInRange) {
    let minDist = Infinity;
    let nearestEnemy;
    for (let i = 0; i < enemiesInRange.length; i++) {
      const dist = dist(this, enemiesInRange[i]);
      if (dist < minDist) {
        nearestEnemy = enemiesInRange[i];
        minDist = dist;
      }
    }
    return nearestEnemy;
  }

  atDestination() {
    return dist(this, this.targetPos) <= this.size;
  }

  stopAttacking() {
    this.isAttacking = false;
  }

  destroy() { }

  getState() {
    return {
      type: 'unit',
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
