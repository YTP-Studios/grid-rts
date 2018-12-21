import * as PIXI from 'pixi.js';
import * as Constants from '../shared/constants';
import Generator from '../shared/generator';
import { BuildingSprite } from './building-sprite';

export default class ClientGenerator extends Generator {
  constructor(game, row, col, team) {
    super(row, col, team);
    this.game = game;

    this.buildingSprite = new BuildingSprite(game, this,
      'assets/generator-edge.png',
      'assets/generator-center.png',
      'assets/generator-core.png');
    this.game.buildingContainer.addChild(this.buildingSprite.sprite);

    this.oldBuildingSprite = new BuildingSprite(game, this,
      'assets/generator-edge.png',
      'assets/generator-center.png',
      'assets/generator-core.png');
    this.game.oldBuildingContainer.addChild(this.oldBuildingSprite.sprite);

    this.sightCircle = new PIXI.Graphics;
    this.sightCircle.clear();
    this.sightCircle.beginFill(0xFFFFFF);
    this.sightCircle.drawCircle(Constants.GRID_SCALE, Constants.GRID_SCALE, Constants.BUILDING_SIGHT_RANGE);
    this.sightCircle.endFill();
    this.sightCircle.cacheAsBitmap = true;

    this.selectionCircle = new PIXI.Graphics;
    this.selectionCircle.clear();
    this.selectionCircle.lineStyle(Constants.SELECTOR_BOX_BORDER_WIDTH, Constants.SELECTOR_CIRCLE_COLOUR);
    this.selectionCircle.beginFill(0xFFFFFF, Constants.SELECTOR_BOX_OPACITY);
    this.selectionCircle.drawCircle(0, 0, Constants.SELECTOR_CIRCLE_RADIUS + Constants.GENERATOR_SIZE);
    this.selectionCircle.cacheAsBitmap = true;
    this.selectionCircle.x = this.x;
    this.selectionCircle.y = this.y;
    this.game.interfaceContainer.addChild(this.selectionCircle);
  }

  update(delta) {
    super.update(delta);
    this.buildingSprite.update();
    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(this);
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }
    this.scaleCore();
    if (this.isSelected) {
      this.selectionCircle.visible = true;
    } else {
      this.selectionCircle.visible = false;
    }
  }

  scaleCore() {
    this.buildingSprite.coreSprite.height = this.health / Constants.GENERATOR_HEALTH * Constants.GENERATOR_SIZE * 3;
    this.buildingSprite.coreSprite.width = this.health / Constants.GENERATOR_HEALTH * Constants.GENERATOR_SIZE * 3;
  }
}
