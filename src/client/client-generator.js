import * as Constants from '../shared/constants';
import Generator from '../shared/generator';
import { BuildingSprite } from './building-sprite';
import { createCircleSprite } from './sprite-utils';
import { sum } from '../shared/vectors';

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

    this.sightCircle = createCircleSprite(Constants.BUILDING_SIGHT_RANGE);
    this.selectionCircle = createCircleSprite(Constants.SELECTOR_CIRCLE_RADIUS + Constants.GENERATOR_SIZE, Constants.SELECTOR_BOX_BORDER_WIDTH, Constants.SELECTOR_CIRCLE_COLOUR, Constants.SELECTOR_BOX_OPACITY);
    this.selectionCircle.x = this.x;
    this.selectionCircle.y = this.y;
    this.game.interfaceContainer.addChild(this.selectionCircle);
  }

  update(delta) {
    super.update(delta);
    this.buildingSprite.update();
    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(sum(this, { x: Constants.GRID_SCALE, y: Constants.GRID_SCALE }));
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }
    this.scaleCore();
    this.selectionCircle.visible = this.isSelected;
  }

  scaleCore() {
    this.buildingSprite.coreSprite.scale.x = this.health / Constants.GENERATOR_HEALTH / 2;
    this.buildingSprite.coreSprite.scale.y = this.health / Constants.GENERATOR_HEALTH / 2;
  }
}
