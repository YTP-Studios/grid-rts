import Unit from "../shared/unit";
import * as Constants from '../shared/constants';

const UNIT_SIZE = 32;

export class ClientUnit extends Unit {

    constructor(container, x = 0, y = 0, team = Constants.NEUTRAL, 
        color = Constants.NEUTRAL_COLOR, isAttacking = false) {
        super(x, y, UNIT_SIZE, team, color);
        let machineTurretSprite = new PIXI.Sprite(PIXI.loader.resources["assets/machineTurret.png"].texture);
        machineTurretSprite.pivot.x = machineTurretSprite.width / 2;
        machineTurretSprite.pivot.y = machineTurretSprite.height / 2;
        this.sprite = machineTurretSprite;
        this.sprite.tint = this.color;
        this.isAttacking = isAttacking;
        container.addChild(this.sprite);
    }

    update(delta) {
        super.update(delta);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        let vertical_distance = this.targetPos.y - this.y;
        let horizontal_distance = this.targetPos.x - this.x;
        let angle;
        if (this.isAttacking) {
            angle = Math.atan2(this.nearestEnemy.y - this.y, this.nearestEnemy.x - this.x) + Math.PI/2;
        } else {
            angle = Math.atan2(vertical_distance, horizontal_distance) + Math.PI/2; //sprite faces upwards on default so an offset of 90 degrees is needed
        }
        this.sprite.rotation = angle;
    }

}
