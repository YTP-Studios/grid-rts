import { GRID_SCALE } from './constants';
import { Team, NEUTRAL } from './teams';
import GameMap from './game_map';
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
    this.health = health;
    this.powered = false;
  }

  update(delta: number, map: GameMap) {
    if (this.health < 0) {
      this.reset();
    }
  }

  reset() {
    this.team = NEUTRAL;
  }

  checkPowered(map: GameMap) {
    if (this.powered) {
      map.neighbours(this)
        .filter(e => e.team === this.team)
        .forEach(e => e.setPowered(map));
    }
  }

  setPowered(map: GameMap) {
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
