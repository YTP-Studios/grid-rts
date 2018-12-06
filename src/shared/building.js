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
    this.health = health;
    this.powered = false;
    this.isSelected = false;
  }

  update(delta, map) {
    if (this.health < 0) {
      this.reset();
    }
  }

  reset() {
    this.team = NEUTRAL;
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
}
