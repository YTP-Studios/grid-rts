import Generator from "../shared/generator";
import { TEAM_COLOURS, NEUTRAL_COLOR } from "../shared/teams";
import { GRID_SCALE, BASIC_UNIT_SIGHT_RANGE, BUILDING_SIGHT_RANGE } from "../shared/constants";
import { createCenteredSprite, createBuildingSprite } from "./sprite-utils";

export default class ClientGenerator extends Generator {
    constructor(game, row, col, team) {
        super(row, col, team);
        this.game = game;

        this.buildingSprite = createBuildingSprite("assets/generator-edge.png", "assets/generator-center.png", team);
        this.centerSprite = this.centerSprite;
        this.topSprite = this.buildingSprite.topSprite;
        this.bottomSprite = this.buildingSprite.bottomSprite;
        this.leftSprite = this.buildingSprite.leftSprite;
        this.rightSprite = this.buildingSprite.rightSprite;

        this.coreSprite = createCenteredSprite("assets/generator-core.png", GRID_SCALE);

        this.buildingSprite.container.addChild(this.coreSprite);

        this.sprite = this.buildingSprite.container;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.game.buildingContainer.addChild(this.sprite);

        this.oldBuildingSprite = createBuildingSprite("assets/generator-edge.png", "assets/generator-center.png", team);
        this.oldBuildingSprite.container.addChild(createCenteredSprite("assets/generator-core.png", GRID_SCALE));
        this.oldBuildingSprite.container.x = this.x;
        this.oldBuildingSprite.container.y = this.y;
        this.game.oldBuildingContainer.addChild(this.oldBuildingSprite.container);

        this.sightCircle = new PIXI.Graphics;
        this.sightCircle.clear();
        this.sightCircle.beginFill(0xFFFFFF);
        this.sightCircle.drawCircle(GRID_SCALE, GRID_SCALE, BUILDING_SIGHT_RANGE);
        this.sightCircle.endFill();
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
        if (this.team == this.game.playerTeam) {
            this.sightCircle.position.copy(this);
            this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
        }
    }
}
