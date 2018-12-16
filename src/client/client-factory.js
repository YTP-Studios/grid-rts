import * as PIXI from 'pixi.js';
import { GRID_SCALE, BUILDING_SIGHT_RANGE, SELECTOR_BOX_BORDER_WIDTH, SELECTOR_CIRCLE_COLOUR, SELECTOR_BOX_OPACITY, SELECTOR_CIRCLE_RADIUS, FACTORY_SIZE, FACTORY_HEALTH, SPAWN_RADIUS } from '../shared/constants';
import { checkBuildingColours, createBuildingSprite, createCenteredSprite } from './sprite-utils';
import Factory from '../shared/factory';
import { TEAM_COLOURS, NEUTRAL } from '../shared/teams';
export default class ClientFactory extends Factory {
  constructor(game, row, col, team) {
    super(row, col, team);
    this.game = game;

    this.buildingSprite = createBuildingSprite('assets/factory-edge.png', 'assets/factory-center.png', team);
    this.centerSprite = this.buildingSprite.centerSprite;
    this.topSprite = this.buildingSprite.topSprite;
    this.bottomSprite = this.buildingSprite.bottomSprite;
    this.leftSprite = this.buildingSprite.leftSprite;
    this.rightSprite = this.buildingSprite.rightSprite;

    this.coreSprite = createCenteredSprite('assets/factory-core.png', GRID_SCALE);

    this.buildingSprite.container.addChild(this.coreSprite);

    this.sprite = this.buildingSprite.container;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.game.buildingContainer.addChild(this.sprite);

    this.oldBuildingSprite = createBuildingSprite('assets/factory-edge.png', 'assets/factory-center.png', team);
    this.oldBuildingSprite.container.addChild(createCenteredSprite('assets/factory-core.png', GRID_SCALE));
    this.oldBuildingSprite.container.x = this.x;
    this.oldBuildingSprite.container.y = this.y;
    this.game.oldBuildingContainer.addChild(this.oldBuildingSprite.container);

    this.spawnCircle = new PIXI.Graphics;
    this.spawnCircle.clear();
    this.spawnCircle.lineStyle(SELECTOR_BOX_BORDER_WIDTH, 0xFFFFFF);
    this.spawnCircle.beginFill(0xFFFFFF, SELECTOR_BOX_OPACITY / 2);
    this.spawnCircle.drawCircle(0, 0, SPAWN_RADIUS);
    this.spawnCircle.endFill();
    this.spawnCircle.visible = false;
    this.spawnCircle.x = this.x;
    this.spawnCircle.y = this.y;
    this.game.interfaceContainer.addChild(this.spawnCircle);

    this.sightCircle = new PIXI.Graphics;
    this.sightCircle.clear();
    this.sightCircle.beginFill(0xFFFFFF);
    this.sightCircle.drawCircle(GRID_SCALE, GRID_SCALE, BUILDING_SIGHT_RANGE);
    this.sightCircle.endFill();

    this.selectionCircle = new PIXI.Graphics;
    this.game.buildingContainer.addChild(this.selectionCircle);
  }

  update(delta, map) {
    super.update(delta, map);
    const { team, row, col } = this;
    checkBuildingColours(this.buildingSprite, map, team, row, col);
    this.spawnCircle.tint = TEAM_COLOURS[this.team];
    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(this);
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }
    if (this.team === NEUTRAL) {
      this.spawnCircle.visible = false;
    }
    this.scaleCore();
    if (this.isSelected) {
      this.drawSelectionCircle();
    } else {
      this.selectionCircle.clear();
    }
  }

  drawSelectionCircle() {
    this.selectionCircle.clear();
    this.selectionCircle.lineStyle(SELECTOR_BOX_BORDER_WIDTH, SELECTOR_CIRCLE_COLOUR);
    this.selectionCircle.beginFill(TEAM_COLOURS[this.team], SELECTOR_BOX_OPACITY);
    this.selectionCircle.drawCircle(this.x, this.y, SELECTOR_CIRCLE_RADIUS + FACTORY_SIZE);
  }

  scaleCore() {
    this.coreSprite.height = this.health / FACTORY_HEALTH * FACTORY_SIZE * 2.5;
    this.coreSprite.width = this.health / FACTORY_HEALTH * FACTORY_SIZE * 2.5;
  }
}
