
import * as Constants from '../shared/constants';
import * as Vectors from '../shared/vectors';
import { TEAM_COLOURS, NEUTRAL } from "../shared/teams";
import { createCenteredSprite } from "./sprite-utils";
import BasicUnit from '../shared/basic_unit';

export class BasicClientUnit extends BasicUnit {

    constructor(parentContainer, x = 0, y = 0, team = NEUTRAL, isAttacking = false) {
        super(x, y, Constants.BASIC_UNIT_BODY_SIZE, team);
        this.parentContainer = parentContainer;

        let spriteContainer = new PIXI.Container();
        spriteContainer.pivot.x = spriteContainer.width / 2;
        spriteContainer.pivot.y = spriteContainer.height / 2;
        this.sprite = spriteContainer;
        this.parentContainer.addChild(this.sprite);

        this.basicUnitSprite = createCenteredSprite("assets/basic-unit-body.png", Constants.BASIC_UNIT_BODY_SIZE * 4);
        this.basicUnitSprite.tint = TEAM_COLOURS[this.team];
        this.sprite.addChild(this.basicUnitSprite);

        this.basicUnitCoreSprite = createCenteredSprite("assets/basic-unit-core.png", Constants.BASIC_UNIT_BODY_SIZE * 4);
        this.sprite.addChild(this.basicUnitCoreSprite);

        let laser = new PIXI.Graphics;
        laser.lineStyle(10, TEAM_COLOURS[this.team]);
        this.laser = laser;
        this.isAttacking = isAttacking;
        this.parentContainer.addChild(this.laser);
    }

    update(delta) {
        super.update(delta);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        let vertical_distance = this.targetPos.y - this.y;
        let horizontal_distance = this.targetPos.x - this.x;
        let angle;
        if (this.isAttacking) {
            angle = Math.atan2(this.nearestEnemy.y - this.y, this.nearestEnemy.x - this.x) + Math.PI / 2;
        } else {
            angle = Math.atan2(vertical_distance, horizontal_distance) + Math.PI / 2; //sprite faces upwards on default so an offset of 90 degrees is needed
        }
        this.sprite.rotation = angle;
        this.scaleUnitCore();

        if (this.health < 0) {
            this.deleteUnitSprites();
        }
    }

    attack(nearestEnemy) {
        super.attack(nearestEnemy);
        this.drawLaser(nearestEnemy);
    }

    drawLaser(nearestEnemy) {
        this.laser.clear();
        this.laser.lineStyle(10, TEAM_COLOURS[this.team]);
        this.laser.position.set(0, 0);
        const direction = Vectors.difference(nearestEnemy, this);
        const offset = Vectors.scaleTo(direction, Constants.BASIC_UNIT_TURRET_LENGTH);
        const startPos = Vectors.sum(Vectors.sum(this, Vectors.scaleTo(direction, this.size)), offset);
        const endPos = Vectors.difference(nearestEnemy, Vectors.scaleTo(direction, nearestEnemy.size));
        this.laser.moveTo(startPos.x, startPos.y);
        this.laser.lineTo(endPos.x, endPos.y);
        this.laser.blendMode = PIXI.BLEND_MODES.ADD;
    }

    stopAttacking() {
        super.stopAttacking();
        this.laser.clear();
    }

    deleteUnitSprites() {
        this.sprite.removeChild(this.basicUnitSprite);
        this.parentContainer.removeChild(this.laser);
        this.parentContainer.removeChild(this.sprite);
    }

    scaleUnitCore() {
        this.basicUnitCoreSprite.height = this.health / Constants.BASIC_UNIT_HEALTH * Constants.BASIC_UNIT_BODY_SIZE * 4;
        this.basicUnitCoreSprite.width = this.health / Constants.BASIC_UNIT_HEALTH * Constants.BASIC_UNIT_BODY_SIZE * 4;
    }
}
