import * as PIXI from 'pixi.js';
import { BUILDING_SIGHT_RANGE, SELECTOR_CIRCLE_RADIUS, CONDUIT_SIZE, SELECTOR_BOX_BORDER_WIDTH, SELECTOR_CIRCLE_COLOUR, SELECTOR_BOX_OPACITY, HEALTHBAR_WIDTH, GRID_SCALE, CONDUIT_HEALTH } from '../shared/constants';
import { NEUTRAL } from '../shared/teams';
import Conduit from '../shared/conduit';
import { BuildingSprite } from './building-sprite';
import { createCircleSprite } from './sprite-utils';
import { add } from '../shared/vectors';

export default class ClientConduit extends Conduit {
  constructor(game, row, col, team) {
    super(row, col, team);
    this.game = game;

    this.buildingSprite = new BuildingSprite(game, this, 'assets/conduit-edge.png', 'assets/conduit-center.png');
    this.game.buildingContainer.addChild(this.buildingSprite.sprite);

    this.oldBuildingSprite = new BuildingSprite(game, this, 'assets/conduit-edge.png', 'assets/conduit-center.png');
    this.game.oldBuildingContainer.addChild(this.oldBuildingSprite.sprite);

    this.sightCircle = createCircleSprite(BUILDING_SIGHT_RANGE);
    this.selectionCircle = createCircleSprite(SELECTOR_CIRCLE_RADIUS + CONDUIT_SIZE, SELECTOR_BOX_BORDER_WIDTH, SELECTOR_CIRCLE_COLOUR, SELECTOR_BOX_OPACITY);
    this.selectionCircle.x = this.x;
    this.selectionCircle.y = this.y;
    this.game.interfaceContainer.addChild(this.selectionCircle);

    this.healthBar = new PIXI.Graphics;
    this.healthBar.clear();
    this.healthBar.beginFill(0x00FF00);
    this.healthBar.drawRect(0, 0, HEALTHBAR_WIDTH, 5);
    this.healthBar.x = this.x - CONDUIT_SIZE / 2;
    this.healthBar.y = this.y - CONDUIT_SIZE / 2 - 10;
    this.healthBar.visible = false;
    this.game.interfaceContainer.addChild(this.healthBar);
  }

  update(delta) {
    super.update(delta);
    this.buildingSprite.update();
    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(add(this, { x: GRID_SCALE, y: GRID_SCALE }));
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }
    this.healthBar.visible = this.health < CONDUIT_HEALTH && this.team !== NEUTRAL;
    this.healthBar.scale.x = this.health / this.maxHealth;
    this.selectionCircle.visible = this.isSelected;
  }
}
