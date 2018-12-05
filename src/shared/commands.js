import { NEUTRAL } from "./teams";

export const commands = new Map();

export class Command {
    exec(game) { }

    static toData(command) {
        return { type: command.constructor.name, ...command };
    }

    static fromData(data) {
        let command = commands.get(data.type);
        return new command(data);
    }
}

export class MoveCommand {
    constructor({ targetPos, unitIds }) {
        this.targetPos = targetPos;
        this.unitIds = unitIds;
    }

    exec(game) {
        game.units
            .filter(u => this.unitIds.some(id => id == u.id))
            .forEach(u => u.targetPos = { ...this.targetPos });
    }
}


export class CaptureCommand {
    constructor({ row, col, team }) {
        this.row = row;
        this.col = col;
        this.team = team;
    }

    exec(game) {
        const { row, col, team } = this;
        const building = game.map.getBuilding(row, col);
        if (building && building.team == NEUTRAL) {
            const neighbours = [
                game.map.getBuilding(row + 1, col),
                game.map.getBuilding(row - 1, col),
                game.map.getBuilding(row, col + 1),
                game.map.getBuilding(row, col - 1),
            ]
            if (neighbours.some(e => e && e.team == team)) {
                building.team = team;
            }
        }
    }
}

commands.set("MoveCommand", MoveCommand);
commands.set("CaptureCommand", CaptureCommand);
