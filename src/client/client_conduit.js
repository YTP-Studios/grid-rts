import * as PIXI from 'pixi.js';
import * as Constants from '../shared/constants';
import { checkBuildingColours, createBuildingSprite } from './sprite-utils';
import { TEAM_COLOURS } from '../shared/teams';
import Conduit from '../shared/conduit';

export default class ClientConduit extends Conduit {
  constructor(game, row, col, team) {
    super(row, col, team);
    this.game = game;

    this.buildingSprite = createBuildingSprite('assets/conduit-edge.png', 'assets/conduit-center.png', team);
    this.centerSprite = this.buildingSprite.centerSprite;
    this.topSprite = this.buildingSprite.topSprite;
    this.bottomSprite = this.buildingSprite.bottomSprite;
    this.leftSprite = this.buildingSprite.leftSprite;
    this.rightSprite = this.buildingSprite.rightSprite;

    this.sprite = this.buildingSprite.container;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.game.buildingContainer.addChild(this.sprite);

    this.oldBuildingSprite = createBuildingSprite('assets/conduit-edge.png', 'assets/conduit-center.png', team);
    this.oldBuildingSprite.container.x = this.x;
    this.oldBuildingSprite.container.y = this.y;
    this.game.oldBuildingContainer.addChild(this.oldBuildingSprite.container);

    this.sightCircle = new PIXI.Graphics;
    this.sightCircle.clear();
    this.sightCircle.beginFill(0xFFFFFF);
    this.sightCircle.drawCircle(Constants.GRID_SCALE, Constants.GRID_SCALE, Constants.BUILDING_SIGHT_RANGE);
    this.sightCircle.endFill();

    this.selectionCircle = new PIXI.Graphics;
    this.game.buildingContainer.addChild(this.selectionCircle);
  }

  update(delta, map) {
    super.update(delta, map);
    const { team, row, col } = this;
    checkBuildingColours(this.buildingSprite, map, team, row, col);
    if (this.team === this.game.playerTeam) {
      this.sightCircle.position.copy(this);
      this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
    }

    if (this.isSelected) {
      this.drawSelectionCircle();
    } else {
      this.selectionCircle.clear();
    }
  }

  drawSelectionCircle() {
    this.selectionCircle.clear();
    this.selectionCircle.lineStyle(Constants.SELECTOR_BOX_BORDER_WIDTH, Constants.SELECTOR_CIRCLE_COLOR);
    this.selectionCircle.beginFill(TEAM_COLOURS[this.team], Constants.SELECTOR_BOX_OPACITY);
    this.selectionCircle.drawCircle(this.x, this.y, Constants.SELECTOR_CIRCLE_RADIUS + Constants.CONDUIT_SIZE);
  }
}
