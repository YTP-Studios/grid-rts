import Factory from '../../shared/factory';
import { GRID_SCALE, BUILDING_SIGHT_RANGE, SELECTOR_BOX_BORDER_WIDTH, SELECTOR_CIRCLE_COLOUR, SELECTOR_BOX_OPACITY, SELECTOR_CIRCLE_RADIUS, FACTORY_SIZE, FACTORY_HEALTH, SPAWN_RADIUS } from '../../shared/constants';
import { TEAM_COLOURS, NEUTRAL } from '../../shared/teams';
import { BuildingSprite } from './building-sprite';
import { add } from '../../shared/vectors';
import { createCircleSprite } from './sprite-utils';
export default class ClientFactory extends Factory {
  constructor(game, row, col, team) {
    super(row, col, team);
    this.game = game;

    this.buildingSprite = new BuildingSprite(game, this,
      '/assets/factory-edge.png',
      '/assets/factory-center.png',
      '/assets/factory-core.png');
    this.game.buildingContainer.addChild(this.buildingSprite.sprite);

    this.oldBuildingSprite = new BuildingSprite(game, this,
      '/assets/factory-edge.png',
      '/assets/factory-center.png',
      '/assets/factory-core.png');
    this.game.oldBuildingContainer.addChild(this.oldBuildingSprite.sprite);

    this.spawnCircle = createCircleSprite(SPAWN_RADIUS, SELECTOR_BOX_BORDER_WIDTH, 0xFFFFFF, SELECTOR_BOX_OPACITY / 2);
    this.spawnCircle.visible = false;
    this.spawnCircle.x = this.x;
    this.spawnCircle.y = this.y;
    this.game.interfaceContainer.addChild(this.spawnCircle);

    this.sightCircle = createCircleSprite(BUILDING_SIGHT_RANGE);

    this.selectionCircle = createCircleSprite(SELECTOR_CIRCLE_RADIUS + FACTORY_SIZE, SELECTOR_BOX_BORDER_WIDTH, SELECTOR_CIRCLE_COLOUR, SELECTOR_BOX_OPACITY);
    this.selectionCircle.x = this.x;
    this.selectionCircle.y = this.y;
    this.game.interfaceContainer.addChild(this.selectionCircle);
  }

  update(delta) {
    super.update(delta);
    this.buildingSprite.update();
    this.spawnCircle.tint = TEAM_COLOURS[this.team];
    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(add(this, { x: GRID_SCALE, y: GRID_SCALE }));
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }
    if (this.team === NEUTRAL) this.spawnCircle.visible = false;
    this.selectionCircle.visible = this.isSelected;
    this.scaleCore();
  }

  scaleCore() {
    this.buildingSprite.coreSprite.scale.x = this.health / FACTORY_HEALTH / 2;
    this.buildingSprite.coreSprite.scale.y = this.health / FACTORY_HEALTH / 2;
  }
}
