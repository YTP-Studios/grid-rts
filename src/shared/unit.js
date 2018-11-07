
export default class Unit {

    constructor(x = 0, y = 0, size = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetPos = { x, y };
        this.velocity = { x: 0, y: 0 };
    }

    update(delta) {
        const atDestination = this.targetPos.x <= this.x + this.size / 2 &&
            this.targetPos.x >= this.x - this.size / 2 &&
            this.targetPos.y <= this.y + this.size / 2 &&
            this.targetPos.y >= this.y - this.size / 2;
        if (!atDestination) {
            if (this.x > this.targetPos.x) {
                this.x += this.velocity.x;
                if (this.velocity.x > -2) {
                    this.velocity.x -= 0.05;
                }
            } else {
                this.x += this.velocity.x;
                if (this.velocity.x < 2) {
                    this.velocity.x += 0.05;
                }
            }
            if (this.y > this.targetPos.y) {
                this.y += this.velocity.y;
                if (this.velocity.y > -2) {
                    this.velocity.y -= 0.05;
                }
            } else {
                this.y += this.velocity.y;
                if (this.velocity.y < 2) {
                    this.velocity.y += 0.05;
                }
            }
        }

    }

}
