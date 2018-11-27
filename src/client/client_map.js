import GameMap from "../shared/game_map";
import ClientConduit from "./client_conduit";
import { RED_TEAM, BLUE_TEAM, NEUTRAL } from "../shared/teams";
import ClientGenerator from "./client-generator";
import { BACKGROUND_COLOR, GRID_SCALE } from "../shared/constants";
import { checkBuildingColours } from "./sprite-utils";

export default class ClientMap extends GameMap {
    static fromString(game, s) {
        return new ClientMap(game, s
            .split('\n')
            .map((line, row) => line
                .split("")
                .map((c, col) => ClientMap.fromChar(game, c, row, col))));
    }
    static fromChar(game, c, row, col) {
        switch (c) {
            case '1':
                return new ClientGenerator(game, row, col, RED_TEAM);
            case '2':
                return new ClientGenerator(game, row, col, BLUE_TEAM);
            case '.':
                return new ClientConduit(game, row, col, NEUTRAL);
            default:
                return null;
        }
    }

    constructor(game, data) {
        super(data);
        let background = new PIXI.Graphics;
        background.clear();
        background.beginFill(BACKGROUND_COLOR);
        background.drawRect(-GRID_SCALE / 2, -GRID_SCALE / 2, this.buildings[0].length * GRID_SCALE, this.buildings.length * GRID_SCALE);
        background.endFill();

        game.buildingContainer.addChildAt(background, 0);

        for (let row of data) {
            for (let building of row) {
                if (!building) continue;
                checkBuildingColours(building.oldBuildingSprite, this, building.team, building.row, building.col);
            }
        }
    }

}
