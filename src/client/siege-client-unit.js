import * as PIXI from 'pixi.js';
import * as Constants from '../shared/constants';
import { TEAM_COLOURS, NEUTRAL } from '../shared/teams';
import { createCenteredSprite } from './sprite-utils';
import SiegeUnit from '../shared/siege-unit';

export class SiegeClientUnit extends SiegeUnit {

  constructor(game, x = 0, y = 0, team = NEUTRAL) {
    super(x, y, team);
    this.game = game;
    this.parentContainer = game.unitContainer;

    let spriteContainer = new PIXI.Container();
    spriteContainer.pivot.x = spriteContainer.width / 2;
    spriteContainer.pivot.y = spriteContainer.height / 2;
    this.sprite = spriteContainer;
    this.parentContainer.addChild(this.sprite);

    this.siegeUnitSprite = createCenteredSprite('assets/siege-unit-body.png', Constants.SIEGE_UNIT_BODY_SIZE * 2);
    this.siegeUnitSprite.tint = TEAM_COLOURS[this.team];
    this.sprite.addChild(this.siegeUnitSprite);

    this.siegeUnitCoreSprite = createCenteredSprite('assets/siege-unit-core.png', Constants.SIEGE_UNIT_BODY_SIZE * 2);
    this.sprite.addChild(this.siegeUnitCoreSprite);

    this.isSelected = false;
    this.selectionCircle = new PIXI.Graphics;
    this.game.interfaceContainer.addChild(this.selectionCircle);

    this.aoeField = new PIXI.Graphics;
    this.parentContainer.addChild(this.aoeField);

    this.sightCircle = new PIXI.Graphics;
    this.sightCircle.clear();
    this.sightCircle.beginFill(0xFFFFFF);
    this.sightCircle.drawCircle(Constants.GRID_SCALE, Constants.GRID_SCALE, Constants.BASIC_UNIT_SIGHT_RANGE);
    this.sightCircle.endFill();
    this.hasDrawnAoeField = false;
  }

  update(delta) {
    super.update(delta);
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.rotation += Constants.SIEGE_UNIT_ROTATION_RATE;
    this.scaleUnitCore();

    if (this.isSelected) {
      this.drawSelectionCircle();
    } else {
      this.selectionCircle.clear();
    }

    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(this);
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }
    if (this.health < 0) {
      this.destroy();
    }
  }

  attack(enemies, delta) {
    super.attack(enemies, delta);

    if (!this.hasDrawnAoeField) {
      this.aoeField.clear();
      this.drawAoeField();
    }

    if (this.elapsedTime < 1.5) {
      this.hasDrawnAoeField = false;
    }

    if (this.elapsedTime >= Constants.SIEGE_UNIT_COOLDOWN - 5) {
      this.detonateAoeField();
    }
  }

  drawAoeField() {
    this.aoeField.lineStyle(1, TEAM_COLOURS[this.team]);
    this.aoeField.beginFill(Constants.SELECTOR_CIRCLE_COLOUR, Constants.SIEGE_UNIT_AOE_OPACITY);
    this.aoeField.drawCircle(this.nearestEnemy.x, this.nearestEnemy.y, Constants.SIEGE_UNIT_EXPLOSION_RADIUS);
    this.hasDrawnAoeField = true;
  }

  detonateAoeField() {
    this.aoeField.beginFill(Constants.SELECTOR_CIRCLE_COLOUR);
    this.aoeField.drawCircle(this.aoePos.x, this.aoePos.y, Constants.SIEGE_UNIT_EXPLOSION_RADIUS);
  }


  drawSelectionCircle() {
    this.selectionCircle.clear();
    this.selectionCircle.lineStyle(Constants.SELECTOR_BOX_BORDER_WIDTH, Constants.SELECTOR_CIRCLE_COLOUR);
    this.selectionCircle.beginFill(Constants.SELECTOR_CIRCLE_COLOUR, Constants.SELECTOR_BOX_OPACITY);
    this.selectionCircle.drawCircle(this.x, this.y, Constants.SELECTOR_CIRCLE_RADIUS + Constants.SIEGE_UNIT_BODY_SIZE);
  }


  destroy() {
    this.sprite.removeChild(this.siegeUnitSprite);
    this.parentContainer.removeChild(this.aoeField);
    this.parentContainer.removeChild(this.sprite);
    this.game.interfaceContainer.removeChild(this.selectionCircle);
  }

  scaleUnitCore() {
    this.siegeUnitCoreSprite.height = this.health / Constants.SIEGE_UNIT_HEALTH * Constants.SIEGE_UNIT_BODY_SIZE;
    this.siegeUnitCoreSprite.width = this.health / Constants.SIEGE_UNIT_HEALTH * Constants.SIEGE_UNIT_BODY_SIZE;
  }


}
