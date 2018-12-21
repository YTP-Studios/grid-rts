import { createCenteredSprite } from './sprite-utils';
import { TEAM_COLOURS, NEUTRAL_COLOUR, DISABLED_TEAM_COLOURS, NEUTRAL } from '../shared/teams';
import { GRID_SCALE } from '../shared/constants';
import * as PIXI from 'pixi.js';
import Game from '../shared/game';
import Building from '../shared/building';

export class BuildingSprite {
    private game: Game;
    private building: Building;
    centerSprite: PIXI.Sprite;
    coreSprite?: PIXI.Sprite;
    topSprite: PIXI.Sprite;
    bottomSprite: PIXI.Sprite;
    leftSprite: PIXI.Sprite;
    rightSprite: PIXI.Sprite;
    sprite: PIXI.Container;

    constructor(game, building, edgePath, centerPath, corePath?) {
        this.game = game;
        this.building = building;
        const { x, y, team = NEUTRAL } = building;

        this.sprite = new PIXI.Container();

        this.centerSprite = createCenteredSprite(centerPath, GRID_SCALE);
        this.centerSprite.tint = TEAM_COLOURS[team];
        this.sprite.addChild(this.centerSprite);

        if (corePath) {
            this.coreSprite = createCenteredSprite(corePath, GRID_SCALE);
            this.sprite.addChild(this.coreSprite);
        }

        const initEdgeSprite = (angle) => {
            let newSprite = createCenteredSprite(edgePath, GRID_SCALE);
            newSprite.rotation = angle;
            newSprite.tint = NEUTRAL_COLOUR;
            return newSprite;
        };

        this.topSprite = initEdgeSprite(0);
        this.bottomSprite = initEdgeSprite(Math.PI * 2 / 2);
        this.leftSprite = initEdgeSprite(Math.PI * 3 / 2);
        this.rightSprite = initEdgeSprite(Math.PI * 1 / 2);

        this.sprite.addChild(this.topSprite);
        this.sprite.addChild(this.bottomSprite);
        this.sprite.addChild(this.leftSprite);
        this.sprite.addChild(this.rightSprite);
        this.sprite.x = x;
        this.sprite.y = y;
    }

    update() {
        const { powered, shouldCapture, row, col, team } = this.building;
        const colours = powered && !shouldCapture ? TEAM_COLOURS : DISABLED_TEAM_COLOURS;
        const checkColour = (row, col, sprite) => {
            let building = this.game.map.getBuilding(row, col);
            if (building === null) {
                sprite.visible = false;
            } else if (building.team === team) {
                sprite.visible = true;
                sprite.tint = colours[team];
            } else {
                sprite.visible = true;
                sprite.tint = colours[NEUTRAL];
            }
        };
        checkColour(row - 1, col, this.topSprite);
        checkColour(row + 1, col, this.bottomSprite);
        checkColour(row, col - 1, this.leftSprite);
        checkColour(row, col + 1, this.rightSprite);
        this.centerSprite.tint = colours[team];
    }
}
