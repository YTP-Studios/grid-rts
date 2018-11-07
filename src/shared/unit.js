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
        const atDestination = this.targetPos.x <= this.x + this.size / 2 &&
            this.targetPos.x >= this.x - this.size / 2 &&
            this.targetPos.y <= this.y + this.size / 2 &&
            this.targetPos.y >= this.y - this.size / 2;
        if (!atDestination) {
            const dx = this.targetPos.x - this.x;
            const dy = this.targetPos.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const dx_normalized = dx / dist;
            const dy_normalized = dy / dist;

            this.velocity.x = dx_normalized * UNIT_SPEED;
            this.velocity.y = dy_normalized * UNIT_SPEED;

            this.x += this.velocity.x * delta;
            this.y += this.velocity.y * delta;
        }

    }

}
