import GameMap from "../shared/game_map";
import ClientConduit from "./client_conduit";
import { RED_TEAM, BLUE_TEAM, NEUTRAL } from "../shared/teams";
import ClientGenerator from "./client-generator";

export default class ClientMap extends GameMap {
    static fromString(game, s) {
        return new ClientMap(s
            .split('\n')
            .map((line, row) => line
                .split("")
                .map((c, col) => ClientMap.fromChar(game, c, row, col))))
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

}
