import Conduit from './conduit';
import Generator from './generator';
import { RED_TEAM, BLUE_TEAM, NEUTRAL } from './teams';
import Factory from './factory';
import Building from './building';
import { GRID_SCALE } from './constants';

export default class GameMap {

  buildings: Building[][]

  static fromString(s) {
    return new GameMap(s
      .split('\n')
      .map((line, row) => line
        .split('')
        .map((c, col) => GameMap.fromChar(c, row, col))));
  }

  static fromChar(c, row, col) {
    switch (c) {
      case '0':
        return new Generator(row, col, NEUTRAL);
      case '1':
        return new Generator(row, col, RED_TEAM);
      case '2':
        return new Generator(row, col, BLUE_TEAM);
      case 'F':
        return new Factory(row, col, NEUTRAL);
      case '.':
        return new Conduit(row, col, NEUTRAL);
      default:
        return null;
    }
  }

  get width() {
    return this.buildings[0].length * GRID_SCALE;
  }

  get height() {
    return this.buildings.length * GRID_SCALE;
  }

  get topLeft() {
    return { x: -GRID_SCALE / 2, y: -GRID_SCALE / 2 };
  }

  get bottomRight() {
    return { x: this.width - GRID_SCALE / 2, y: this.height - GRID_SCALE / 2 };
  }

  constructor(buildings: Building[][]) {
    this.buildings = buildings;
  }

  toString() {
    return this.buildings.map(row => row.map(b => {
      if (b instanceof Generator) {
        return b.team.toString();
      } else if (b instanceof Factory) {
        return 'F';
      } else if (b instanceof Conduit) {
        return '.';
      } else {
        return ' ';
      }
    }).join('')).join('\n');
  }

  allBuildings() {
    return this.buildings
      .reduce((acc, cur) => acc.concat(cur), [])
      .filter(b => b !== null);
  }

  neighbours(building: Building) {
    const { row, col } = building;
    return [
      this.getBuilding(row, col + 1),
      this.getBuilding(row, col - 1),
      this.getBuilding(row + 1, col),
      this.getBuilding(row - 1, col),
    ].filter(e => e !== null);
  }

  update(delta: number) {
    const buildings = this.allBuildings();
    buildings.forEach(b => {
      b.powered = false;
    });
    buildings.forEach(b => {
      b.checkPowered(this);
    });
    buildings.forEach(b => {
      b.update(delta, this);
    });
  }

  getBuilding(row: number, col: number) {
    if (row < 0 || row >= this.buildings.length) return null;
    if (col < 0 || col >= this.buildings[row].length) return null;
    return this.buildings[row][col];
  }

  setState(data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (!this.buildings[i][j]) continue;
        this.buildings[i][j].setState(data[i][j]);
      }
    }
  }

  getState() {
    return this.buildings.map(row => row
      .map(building => building && building.getState()));
  }
}
