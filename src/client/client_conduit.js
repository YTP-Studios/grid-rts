import Conduit from "../shared/conduit";
import { GRID_SCALE } from "../shared/constants";
import * as PIXI from 'pixi.js'
import { NEUTRAL_COLOR, TEAM_COLOURS } from "../shared/teams";


export default class ClientConduit extends Conduit {
    constructor(container, row, col, team) {
        super(row, col, team);

        let edgeTexture = PIXI.loader.resources["assets/conduit-edge.png"].texture;
        let centerTexture = PIXI.loader.resources["assets/conduit-center.png"].texture;

        this.centerSprite = new PIXI.Sprite(centerTexture);
        this.centerSprite.tint = TEAM_COLOURS[team];
        this.centerSprite.pivot.x = centerTexture.width / 2;
        this.centerSprite.pivot.y = centerTexture.height / 2;
        this.centerSprite.width = GRID_SCALE;
        this.centerSprite.height = GRID_SCALE;

        const initEdgeSprite = (angle) => {
            let newSprite = new PIXI.Sprite(edgeTexture);
            newSprite.pivot.x = edgeTexture.width / 2;
            newSprite.pivot.y = edgeTexture.height / 2;
            newSprite.width = GRID_SCALE;
            newSprite.height = GRID_SCALE;
            newSprite.rotation = angle;
            newSprite.tint = NEUTRAL_COLOR;
            return newSprite;
        }

        this.topSprite = initEdgeSprite(0);
        this.bottomSprite = initEdgeSprite(Math.PI * 2 / 2);
        this.leftSprite = initEdgeSprite(Math.PI * 3 / 2);
        this.rightSprite = initEdgeSprite(Math.PI * 1 / 2);

        let conduitSprite = new PIXI.Container();
        conduitSprite.addChild(this.centerSprite);
        conduitSprite.addChild(this.topSprite);
        conduitSprite.addChild(this.bottomSprite);
        conduitSprite.addChild(this.leftSprite);
        conduitSprite.addChild(this.rightSprite);

        this.sprite = conduitSprite;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        container.addChild(this.sprite);
    }

    update(delta, map) {
        super.update(delta, map);
        const checkColour = (row, col, sprite) => {
            let building = map.getBuilding(row, col);
            if (building == null) {
                sprite.visible = false;
            } else if (building.team == this.team) {
                sprite.visible = true;
                sprite.tint = TEAM_COLOURS[this.team];
            }
        }
        const { row, col } = this;
        checkColour(row - 1, col, this.topSprite);
        checkColour(row + 1, col, this.bottomSprite);
        checkColour(row, col - 1, this.leftSprite);
        checkColour(row, col + 1, this.rightSprite);

    }
}
