import Unit from "../shared/unit";
import * as Constants from '../shared/constants';
import * as Vectors from '../shared/vectors';

export class ClientUnit extends Unit {

    constructor(container, x = 0, y = 0, team = Constants.NEUTRAL,
        color = Constants.NEUTRAL_COLOR, isAttacking = false) {
        super(x, y, Constants.UNIT_BODY_SIZE, team, color);
        this.container = container;
        let machineTurretSprite = new PIXI.Sprite(PIXI.loader.resources["assets/basic-unit-body.png"].texture);
        machineTurretSprite.pivot.x = machineTurretSprite.width / 2;
        machineTurretSprite.pivot.y = machineTurretSprite.height / 2;
        machineTurretSprite.width = Constants.UNIT_BODY_SIZE * 4;
        machineTurretSprite.height = Constants.UNIT_BODY_SIZE * 4;

        this.sprite = machineTurretSprite;
        this.sprite.tint = this.color;
        this.container.addChild(this.sprite);

        let laser = new PIXI.Graphics;
        laser.lineStyle(10, this.color);
        this.laser = laser;
        this.isAttacking = isAttacking;
        this.container.addChild(this.laser);
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
        this.laser.lineStyle(10, this.color);
        this.laser.position.set(0, 0);
        const direction = Vectors.difference(nearestEnemy, this);
        const offset = Vectors.scaleTo(direction, Constants.UNIT_TURRET_LENGTH);
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
        this.container.removeChild(this.sprite);
        this.container.removeChild(this.laser);
    }
}
