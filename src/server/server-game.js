import Game from '../shared/game';
import GameMap from '../shared/game_map';
import BasicUnit from '../shared/basic_unit';
import { NEUTRAL, RED_TEAM, BLUE_TEAM } from '../shared/teams';

export default class ServerGame extends Game {
    constructor(io) {
        super();
        this.io = io;
    }

    init() {
        super.init(new GameMap([[]]), [
            new BasicUnit(0, 0, NEUTRAL),
            new BasicUnit(0, 500, RED_TEAM),
            new BasicUnit(0, 450, RED_TEAM),
            new BasicUnit(50, 500, RED_TEAM),
            new BasicUnit(500, 0, BLUE_TEAM),
            new BasicUnit(450, 0, BLUE_TEAM),
            new BasicUnit(500, 50, BLUE_TEAM),
            new BasicUnit(500, 500, NEUTRAL),
        ]);
    }

    update(delta) {
        super.update(delta);
        this.io.emit("game_state", this.getState());
    }
}
