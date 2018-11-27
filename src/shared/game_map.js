import Conduit from "./conduit";
import Generator from "./generator";
import { RED_TEAM, BLUE_TEAM, NEUTRAL } from "./teams";

export default class GameMap {

    static fromString(s) {
        return new GameMap(s
            .split('\n')
            .map((line, row) => line
                .split("")
                .map((c, col) => GameMap.fromChar(c, row, col))));
    }

    static fromChar(c, row, col) {
        switch (c) {
            case '1':
                return new Generator(row, col, RED_TEAM);
            case '2':
                return new Generator(row, col, BLUE_TEAM);
            case '.':
                return new Conduit(row, col, NEUTRAL);
            default:
                return null;
        }
    }

    constructor(buildings) {
        this.buildings = buildings;
    }

    update(delta) {
        this.buildings.forEach(arr => arr.forEach(b => b && b.update(delta, this)));
    }

    getBuilding(row, col) {
        if (row < 0 || row >= this.buildings.length) return null;
        if (col < 0 || col >= this.buildings[row].length) return null;
        return this.buildings[row][col];
    }

    setState() {
        // TODO: unimplemented
    }

    getState() {
        // TODO: unimplemented
    }
}
