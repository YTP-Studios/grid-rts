import { GRID_SCALE } from './constants';
import { Team, NEUTRAL } from './teams';
import GameMap from './game-map';
import { Entity } from './entity';
export default class Building implements Entity {

  row: number;
  col: number;
  team: Team;
  size: number;
  health: number;
  powered: boolean;

  get x() {
    return this.col * GRID_SCALE;
  }
  get y() {
    return this.row * GRID_SCALE;
  }

  constructor(row, col, team, size, health) {
    this.row = row;
    this.col = col;
    this.team = team;
    this.size = size;
    this.powered = false;
    this.isSelected = false;
    this.health = this.team === NEUTRAL ? 0 : health;
    this.shouldCapture = false;
    this.elapsedTime = 0;
    this.captureTime = 0;
    this.maxHealth = 0;
    this.income = 0;
    this.energyCap = 0;
  }

  update(delta: number) {
    if (this.health < 0 && this.team !== NEUTRAL) {
      this.reset();
    }
    if (this.shouldCapture && this.powered) {
      this.capture(delta);
    }
  }

  reset() {
    this.team = NEUTRAL;
    this.health = 0;
    this.powered = false;
  }

  checkPowered(map: GameMap) {
    if (this.powered && !this.shouldCapture) {
      map.neighbours(this)
        .filter(e => e.team === this.team)
        .forEach(e => e.setPowered(map));
    }
  }

  setPowered(map: GameMap) {
    if (this.powered) return;
    this.powered = true;
    if (!this.shouldCapture) {
      map.neighbours(this)
        .filter(e => e.team === this.team)
        .forEach(e => e.setPowered(map));
    }
  }

  getState() {
    return {
      team: this.team,
      health: this.health,
      shouldCapture: this.shouldCapture,
      captureTime: this.captureTime,
    };
  }

  setState({ team, health, shouldCapture, captureTime }) {
    this.team = team;
    this.health = health;
    this.shouldCapture = shouldCapture;
    this.captureTime = captureTime;
  }

  capture(delta) {
    if (this.elapsedTime >= this.captureTime) {
      this.elapsedTime = 0;
      this.shouldCapture = false;
    } else {
      this.elapsedTime += delta;
      this.health += delta * this.maxHealth / this.captureTime;
    }
  }
}
