import { GRID_SCALE } from "./constants";
import { NEUTRAL } from "./teams";

export default class Building {

    get x() {
        return this.col * GRID_SCALE;
    }
    get y() {
        return this.row * GRID_SCALE;
    }

    constructor(row, col, team, size, health) {
        this.row = row;
        this.col = col;
        this.team = team;
        this.size = size;
        this.health = health;
    }

    update(delta, map) {
        if (this.health < 0) {
            this.reset();
        }
    }

    reset() {
        this.team = NEUTRAL;
    }

    getState() {
        return {
            team: this.team,
            health: this.health,
        };
    }

    setState({ team, health }) {
        this.team = team;
        this.health = health;
    }
}
