import { NEUTRAL } from './teams';

export const commands = new Map();

export class Command {
  exec(game) { }

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

  exec(game) {
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

  exec(game) {
    const { row, col, team } = this;
    const building = game.map.getBuilding(row, col);
    if (building && building.team === NEUTRAL) {
      const neighbours = game.map.neighbours(building);
      if (neighbours.some(e => e && e.team === team && e.powered)) {
        if (game.energy[team] >= building.getMaxHealth() && !building.shouldCapture) {
          building.captureTime = building.getCaptureTime();
          building.maxHealth = building.getMaxHealth();
          building.newTeam = team;
          building.shouldCapture = true;
          game.energy[team] -= building.getMaxHealth();
        }
      }
    }
  }
}

commands.set('MoveCommand', MoveCommand);
commands.set('CaptureCommand', CaptureCommand);
