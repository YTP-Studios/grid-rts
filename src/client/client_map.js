import GameMap from "../shared/game_map";
import ClientConduit from "./client_conduit";
import { RED_TEAM, BLUE_TEAM, NEUTRAL } from "../shared/teams";
import ClientGenerator from "./client-generator";

export default class ClientMap extends GameMap {
    static fromString(container, s) {
        return new ClientMap(s
            .split('\n')
            .map((line, row) => line
                .split("")
                .map((c, col) => ClientMap.fromChar(container, c, row, col))))
    }
    static fromChar(container, c, row, col) {
        switch (c) {
            case '1':
                return new ClientGenerator(container, row, col, RED_TEAM);
            case '2':
                return new ClientGenerator(container, row, col, BLUE_TEAM);
            case '.':
                return new ClientConduit(container, row, col, NEUTRAL);
            default:
                return null;
        }
    }

}
