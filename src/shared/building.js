import { GRID_SCALE } from './constants';
import { NEUTRAL } from './teams';

export default class Building {

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
    this.health = this.team === NEUTRAL ? 1 : health;
    this.shouldCapture = false;
    this.maxHealth = 0;
    this.newTeam = NEUTRAL;
  }

  update(delta, map) {
    this.delta = delta;
    if (this.health < 0) {
      this.reset();
    }
    if (this.shouldCapture) {
      this.capture(delta);
    }
  }

  reset() {
    this.team = NEUTRAL;
    this.health = 1;
  }

  checkPowered(map) {
    if (this.powered) {
      map.neighbours(this)
        .filter(e => e.team === this.team)
        .forEach(e => e.setPowered(map));
    }
  }

  setPowered(map) {
    if (this.powered) return;
    this.powered = true;
    map.neighbours(this)
      .filter(e => e.team === this.team)
      .forEach(e => e.setPowered(map));
  }

  getState() {
    return {
      team: this.team,
      health: this.health,
    };
  }

  setState({ team, health }) {
    this.team = team;
    this.health = health;
  }

  capture(delta) {
    if (this.health >= this.maxHealth) {
      this.health = this.maxHealth;
      this.shouldCapture = false;
      this.team = this.newTeam;
    } else {
      this.health += delta * 2;
    }
  }
}
