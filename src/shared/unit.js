import * as Vectors from '../shared/vectors';

const UNIT_SPEED = 2.0;

export default class Unit {

    constructor(x = 0, y = 0, size = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetPos = { x, y };
        this.velocity = { x: 0, y: 0 };

    }

    update(delta) {
        if (!this.atDestination()) {
            const displacement = Vectors.difference(this.targetPos, this)
            this.velocity = Vectors.scaleTo(displacement, UNIT_SPEED);

            this.x += this.velocity.x * delta;
            this.y += this.velocity.y * delta;
        } else {
            Vectors.copyTo(this, this.targetPos);
        }

    }

    atDestination() {
        return Vectors.dist(this, this.targetPos) <= this.size;
    }
}
