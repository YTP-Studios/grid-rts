import Game from '../shared/game';
import GameMap from '../shared/game_map';
import BasicUnit from '../shared/basic_unit';
import { NEUTRAL, RED_TEAM, BLUE_TEAM } from '../shared/teams';
import { GAME_STATE } from '../shared/game-events';
import { DEFAULT_MAP } from '../shared/constants';

export default class ServerGame extends Game {
    constructor() {
        super();
        this.players = [];
    }

    init(map) {
        super.init(map, [
            new BasicUnit(0, 500, RED_TEAM),
            new BasicUnit(0, 450, RED_TEAM),
            new BasicUnit(50, 500, RED_TEAM),
            new BasicUnit(500, 0, BLUE_TEAM),
            new BasicUnit(450, 0, BLUE_TEAM),
            new BasicUnit(500, 50, BLUE_TEAM),
        ]);
    }

    update(delta) {
        super.update(delta);
    }
}
