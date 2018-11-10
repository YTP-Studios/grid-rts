
export default class GameMap {
    constructor(buildings) {
        this.buildings = buildings;
    }

    update(delta) {
        this.buildings.forEach(arr => arr.forEach(b => b.update(delta, this)));
    }

    getBuilding(i, j) {
        if (i < 0 || i >= this.buildings.length) return null;
        if (j < 0 || j >= this.buildings[i].length) return null;
        return this.buildings[i][j];
    }
}
