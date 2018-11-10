import Conduit from "../shared/conduit";
import { NEUTRAL_COLOR, BLUE_TEAM_COLOR, RED_TEAM_COLOR } from "../shared/constants";
import * as PIXI from 'pixi.js'


export default class ClientConduit extends Conduit {
    constructor(container, i, j, team) {
        super(i, j, team);

        let edgeTexture = PIXI.loader.resources["assets/conduit-edge.png"].texture;
        let centerTexture = PIXI.loader.resources["assets/conduit-center.png"].texture;

        this.centerSprite = new PIXI.Sprite(centerTexture);
        this.centerSprite.tint = [NEUTRAL_COLOR, BLUE_TEAM_COLOR, RED_TEAM_COLOR][team];
        this.centerSprite.pivot.x = centerTexture.width / 2;
        this.centerSprite.pivot.y = centerTexture.height / 2;

        const initEdgeSprite = (angle) => {
            let newSprite = new PIXI.Sprite(edgeTexture);
            newSprite.pivot.x = edgeTexture.width / 2;
            newSprite.pivot.y = edgeTexture.height / 2;
            newSprite.rotation = angle;
            newSprite.tint = NEUTRAL_COLOR;
            return newSprite;
        }

        this.topSprite = initEdgeSprite(0);
        this.leftSprite = initEdgeSprite(Math.PI * 1 / 2);
        this.bottomSprite = initEdgeSprite(Math.PI * 2 / 2);
        this.rightSprite = initEdgeSprite(Math.PI * 3 / 2);

        let conduitSprite = new PIXI.Container();
        conduitSprite.addChild(this.centerSprite);
        conduitSprite.addChild(this.topSprite);
        conduitSprite.addChild(this.leftSprite);
        conduitSprite.addChild(this.bottomSprite);
        conduitSprite.addChild(this.rightSprite);

        this.sprite = conduitSprite;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        container.addChild(this.sprite);
    }

    update(delta, map) {
        super.update(delta, map);
        const checkColour = (i, j, sprite) => {
            let building = map.getBuilding(i, j);
            if (building != null && building.team == this.team) {
                sprite.tint = [NEUTRAL_COLOR, BLUE_TEAM_COLOR, RED_TEAM_COLOR][this.team];
            }
        }
        const { i, j } = this;
        checkColour(i, j - 1, this.topSprite);
        checkColour(i + 1, j, this.leftSprite);
        checkColour(i, j + 1, this.bottomSprite);
        checkColour(i - 1, j, this.rightSprite);

    }
}
