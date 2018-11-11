
export default class GameMap {
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
}
