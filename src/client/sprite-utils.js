import { NEUTRAL, TEAM_COLOURS, NEUTRAL_COLOR } from "../shared/teams";
import { GRID_SCALE, BACKGROUND_COLOR } from "../shared/constants";

export function createCenteredSprite(filePath, width, height = width) {
    let sprite = new PIXI.Sprite(PIXI.loader.resources[filePath].texture);
    sprite.pivot.x = sprite.width / 2;
    sprite.pivot.y = sprite.height / 2;
    sprite.width = width;
    sprite.height = height;
    return sprite;
}

export function createBuildingSprite(edgePath, centerPath, team = NEUTRAL) {
    let sprite = {};
    sprite.centerSprite = createCenteredSprite(centerPath, GRID_SCALE);
    sprite.centerSprite.tint = TEAM_COLOURS[team];

    const initEdgeSprite = (angle) => {
        let newSprite = createCenteredSprite(edgePath, GRID_SCALE);
        newSprite.rotation = angle;
        newSprite.tint = NEUTRAL_COLOR;
        return newSprite;
    }

    sprite.topSprite = initEdgeSprite(0);
    sprite.bottomSprite = initEdgeSprite(Math.PI * 2 / 2);
    sprite.leftSprite = initEdgeSprite(Math.PI * 3 / 2);
    sprite.rightSprite = initEdgeSprite(Math.PI * 1 / 2);

    let spriteContainer = new PIXI.Container();
    spriteContainer.addChild(sprite.centerSprite);
    spriteContainer.addChild(sprite.topSprite);
    spriteContainer.addChild(sprite.bottomSprite);
    spriteContainer.addChild(sprite.leftSprite);
    spriteContainer.addChild(sprite.rightSprite);

    sprite.container = spriteContainer;

    return sprite;
}
