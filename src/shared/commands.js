import { NEUTRAL } from './teams';
import Game from './game';
import { dist } from './vectors';
import Factory from './factory';
import { SPAWN_RADIUS, BASIC_UNIT_COST } from './constants';

export const commands = new Map();

export class Command {
  exec(game: Game) { }

  static toData(command) {
    return { type: command.constructor.name, ...command };
  }

  static fromData(data) {
    let CommandConstructor = commands.get(data.type);
    return new CommandConstructor(data);
  }
}

export class MoveCommand extends Command {
  constructor({ targetPos, unitIds }) {
    super();
    this.targetPos = targetPos;
    this.unitIds = unitIds;
  }

  exec(game: Game) {
    game.units
      .filter(u => this.unitIds.some(id => id === u.id))
      .forEach(u => { u.targetPos = { ...this.targetPos }; });
  }
}


export class CaptureCommand extends Command {
  constructor({ row, col, team }) {
    super();
    this.row = row;
    this.col = col;
    this.team = team;
  }

  exec(game: Game) {
    const { row, col, team } = this;
    const building = game.map.getBuilding(row, col);
    if (building && building.team === NEUTRAL) {
      const neighbours = game.map.neighbours(building);
      if (neighbours.some(e => e && e.team === team && e.powered)) {
        building.team = team;
      }
    }
  }
}

export class SpawnCommand extends Command {
  constructor({ unit }) {
    super();
    this.unit = unit;
  }

  exec(game: Game) {
    const { unit } = this;
    const team = unit.team;
    if (game.map.allBuildings()
      .filter(b => b instanceof Factory)
      .some(b => dist(b, unit) <= SPAWN_RADIUS) &&
      game.energy[team] >= BASIC_UNIT_COST) {
      const newUnit = game.instantiate(unit);
      game.units.push(newUnit);
      game.energy[team] -= BASIC_UNIT_COST;
    }
  }
}

commands.set('MoveCommand', MoveCommand);
commands.set('CaptureCommand', CaptureCommand);
commands.set('SpawnCommand', SpawnCommand);
