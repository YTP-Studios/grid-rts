
import * as Constants from '../shared/constants';
import * as Vectors from '../shared/vectors';
import { TEAM_COLOURS, NEUTRAL } from "../shared/teams";
import { createCenteredSprite } from "./sprite-utils";
import SiegeUnit from '../shared/siege_unit';

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

        this.basicUnitSprite = createCenteredSprite("assets/basic-unit-body.png", Constants.SIEGE_UNIT_BODY_SIZE * 4);
        this.basicUnitSprite.tint = TEAM_COLOURS[this.team];
        this.sprite.addChild(this.basicUnitSprite);

        this.basicUnitCoreSprite = createCenteredSprite("assets/basic-unit-core.png", Constants.SIEGE_UNIT_BODY_SIZE * 4);
        this.sprite.addChild(this.basicUnitCoreSprite);

        this.isSelected = false;
        this.selectionCircle = new PIXI.Graphics;
        this.game.interfaceContainer.addChild(this.selectionCircle);

        this.aoeField = new PIXI.Graphics;
        this.isAttacking = false;
        this.parentContainer.addChild(this.aoeField);

        this.sightCircle = new PIXI.Graphics;
        this.sightCircle.clear();
        this.sightCircle.beginFill(0xFFFFFF);
        this.sightCircle.drawCircle(Constants.GRID_SCALE, Constants.GRID_SCALE, Constants.BASIC_UNIT_SIGHT_RANGE);
        this.sightCircle.endFill();
    }

    update(delta) {
        super.update(delta);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        let vertical_distance = this.targetPos.y - this.y;
        let horizontal_distance = this.targetPos.x - this.x;
        let angle = Math.atan2(vertical_distance, horizontal_distance) + Math.PI / 2; //sprite faces upwards on default so an offset of 90 degrees is needed
        this.sprite.rotation = angle;
        this.scaleUnitCore();

        if (this.isSelected) {
            this.drawSelectionCircle();
        } else {
            this.selectionCircle.clear();
        }

        if (this.team == this.game.playerTeam) {
            this.sightCircle.position.copy(this);
            this.game.app.renderer.render(this.sightCircle, this.game.sightRangeTexture, false, null, false);
        }
        if (this.health < 0) {
            this.destroy();
        }
    }

    attack(nearestEnemy) {
        this.drawAoeField(nearestEnemy);
    }

    drawAoeField(nearestEnemy) {
        this.aoeField.lineStyle(1, TEAM_COLOURS[this.team]);
        this.aoeField.beginFill(Constants.SELECTOR_CIRCLE_COLOR, 0.1);
        this.aoeField.drawCircle(nearestEnemy.x, nearestEnemy.y, 50);
        const curEnemyLocation =  {x: nearestEnemy.x, y: nearestEnemy.y }
        this.detonateAoeField(curEnemyLocation, nearestEnemy);
    }

    detonateAoeField(curEnemyLocation, nearestEnemy) {
        setTimeout(function detonateAoeField() {
            this.aoeField.beginFill(Constants.SELECTOR_CIRCLE_COLOR, 100);
            this.aoeField.drawCircle(curEnemyLocation.x, curEnemyLocation.y, 50);
            this.destroyAoeField(curEnemyLocation, nearestEnemy);
        }.bind(this), 1500);
    }

    destroyAoeField(curEnemyLocation, nearestEnemy) {
        if (this.isInAoeField(curEnemyLocation, nearestEnemy)) {
            super.attack(nearestEnemy);
        }
        setTimeout(function detonateAoeField(){
            this.isAttacking = false;
            this.aoeField.clear();
        }.bind(this), 500);
    }

    isInAoeField(aoeFieldLocation, nearestEnemy) {
        const combinedSize = 50 + nearestEnemy.size;
        const dist = Vectors.dist(aoeFieldLocation, nearestEnemy);
        return dist <= combinedSize;
    }

    drawSelectionCircle() {
        this.selectionCircle.clear();
        this.selectionCircle.lineStyle(Constants.SELECTOR_BOX_BORDER_WIDTH, Constants.SELECTOR_CIRCLE_COLOR);
        this.selectionCircle.beginFill(Constants.SELECTOR_CIRCLE_COLOR, Constants.SELECTOR_BOX_OPACITY);
        this.selectionCircle.drawCircle(this.x, this.y, Constants.SELECTOR_CIRCLE_RADIUS);
    }

    stopAttacking() {
    }

    destroy() {
        this.sprite.removeChild(this.basicUnitSprite);
        this.parentContainer.removeChild(this.aoeField);
        this.parentContainer.removeChild(this.sprite);
        this.game.interfaceContainer.removeChild(this.selectionCircle);
    }

    scaleUnitCore() {
        this.basicUnitCoreSprite.height = this.health / Constants.BASIC_UNIT_HEALTH * Constants.BASIC_UNIT_BODY_SIZE * 4;
        this.basicUnitCoreSprite.width = this.health / Constants.BASIC_UNIT_HEALTH * Constants.BASIC_UNIT_BODY_SIZE * 4;
    }



}
