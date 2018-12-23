import { NEUTRAL, Team } from './teams';
import Game from './game';
import { dist, Vector } from './vectors';
import Factory from './factory';
import { SPAWN_RADIUS, BASIC_UNIT_COST } from './constants';
import Unit from './unit';

export const commands = new Map<string, new (data: any) => Command>();

export abstract class Command {

  abstract validate(game: Game, team: Team): boolean;

  abstract exec(game: Game);

  static toData(command) {
    return { type: command.constructor.name, ...command };
  }

  static fromData(data) {
    let CommandConstructor = commands.get(data.type);
    return new CommandConstructor(data);
  }
}

export class MoveCommand extends Command {
  targetPos: Vector;
  unitIds: string[];
  constructor({ targetPos, unitIds }) {
    super();
    this.targetPos = targetPos;
    this.unitIds = unitIds;
  }

  validate(game, team) {
    return game.units
      .filter(u => this.unitIds.some(id => id === u.id))
      .every(u => u.team === team);
  }

  exec(game: Game) {
    game.units
      .filter(u => this.unitIds.some(id => id === u.id))
      .forEach(u => { u.targetPos = { ...this.targetPos }; });
  }
}


export class CaptureCommand extends Command {
  row: number;
  col: number;
  team: Team;
  constructor({ row, col, team }) {
    super();
    this.row = row;
    this.col = col;
    this.team = team;
  }

  validate(game: Game, playerTeam: Team) {
    const { row, col, team } = this;
    if (team !== playerTeam) return false;
    const building = game.map.getBuilding(row, col);
    if (!building || building.team !== NEUTRAL) return false;
    const neighbours = game.map.neighbours(building);
    if (!neighbours.some(e => e && e.team === team && e.powered && !e.shouldCapture)) return false;
    if (game.energy[team] < building.maxHealth || building.shouldCapture) return false;
    return true;
  }

  exec(game: Game) {
    const { row, col, team } = this;
    const building = game.map.getBuilding(row, col);
    building.captureTime = building.captureTime;
    building.maxHealth = building.maxHealth;
    building.shouldCapture = true;
    building.team = team;
    game.energy[team] -= building.maxHealth;
  }
}

export class SpawnCommand extends Command {
  unit: Unit;
  constructor({ unit }) {
    super();
    this.unit = unit;
  }

  validate(game: Game, team: Team) {
    if (team !== this.unit.team) return false;
    const { unit } = this;
    if (game.map.allBuildings()
      .filter(b => b instanceof Factory)
      .filter(b => b.team === team)
      .filter(b => !b.shouldCapture)
      .some(b => dist(b, unit) <= SPAWN_RADIUS) &&
      game.energy[team] >= BASIC_UNIT_COST) {
      return true;
    }
    return false;
  }

  exec(game: Game) {
    const { unit } = this;
    const newUnit = game.instantiate(unit);
    game.units.push(newUnit);
    game.energy[unit.team] -= BASIC_UNIT_COST;
  }
}

commands.set('MoveCommand', MoveCommand);
commands.set('CaptureCommand', CaptureCommand);
commands.set('SpawnCommand', SpawnCommand);
