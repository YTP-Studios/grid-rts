import Conduit from "./conduit";
import Generator from "./generator";
import { RED_TEAM, BLUE_TEAM, NEUTRAL } from "./teams";
import Factory from "./factory";

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

    constructor(buildings) {
        this.buildings = buildings;
    }

    allBuildings() {
        return this.buildings.reduce((acc, cur) => acc.concat(cur), []);
    }

    neighbours(building) {
        const { row, col } = building;
        return [
            this.getBuilding(row, col + 1),
            this.getBuilding(row, col - 1),
            this.getBuilding(row + 1, col),
            this.getBuilding(row - 1, col),
        ].filter(e => e !== null);
    }

    update(delta) {
        const buildings = this.allBuildings().filter(b => b);
        buildings.forEach(b => {
            b.powered = false;
        });
        buildings.forEach(b => {
            b.checkPowered(this);
        })
        buildings.forEach(b => {
            b.update(delta, this);
        })
    }

    getBuilding(row, col) {
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
