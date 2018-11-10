import { GRID_SCALE } from "./constants";




export default class Building {

    get x() {
        return this.i * GRID_SCALE;
    }
    get y() {
        return this.j * GRID_SCALE;
    }

    constructor(i, j, team) {
        this.i = i;
        this.j = j;
        this.team = team;
    }

    update(delta, map) {

    }
}
