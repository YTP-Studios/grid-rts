import GameMap from "../shared/game_map";
import ClientConduit from "./client_conduit";

export default class ClientMap extends GameMap {
    static fromString(container, s) {
        return new ClientMap(s
            .split('\n')
            .map((line, i) => line
                .split("")
                .map((c, j) => ClientMap.fromChar(container, c, i, j))))
    }
    static fromChar(container, c, i, j) {
        switch (c) {
            case '1':
                return new ClientConduit(container, i, j, 1);
            case '2':
                return new ClientConduit(container, i, j, 2);
            default:
                return new ClientConduit(container, i, j, 0);
        }
    }

}
