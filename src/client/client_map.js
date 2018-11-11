import GameMap from "../shared/game_map";
import ClientConduit from "./client_conduit";

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
                return new ClientConduit(container, row, col, 1);
            case '2':
                return new ClientConduit(container, row, col, 2);
            default:
                return new ClientConduit(container, row, col, 0);
        }
    }

}
