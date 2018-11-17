
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

commands.set("MoveCommand", MoveCommand);
