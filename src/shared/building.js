import { GRID_SCALE } from "./constants";




export default class Building {

    get x() {
        return this.col * GRID_SCALE;
    }
    get y() {
        return this.row * GRID_SCALE;
    }

    constructor(row, col, team) {
        this.row = row;
        this.col = col;
        this.team = team;
    }

    update(delta, map) {

    }
}
