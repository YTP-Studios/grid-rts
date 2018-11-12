import * as Vectors from '../shared/vectors'
import * as Constants from '../shared/constants';

export default class Game {
    init(map, units) {
        this.map = map;
        this.units = units;
    }

    update(delta) {
        this.map.update(delta);
        this.units.forEach((unit) => unit.update(delta));
        this.resolveCollisions();
        this.resolveAttacks();
    }

    resolveCollisions() {
        let positions = this.units.map(({ x, y }) => ({ x, y }));
        for (let i = 0; i < this.units.length; i++) {
            for (let j = i + 1; j < this.units.length; j++) {
                let a = this.units[i], b = this.units[j];
                const combinedSize = a.size + b.size;
                const dist = Vectors.dist(a, b);
                if (dist < combinedSize) {
                    const offset = (combinedSize - dist) / 2 * Constants.COLLISION_LENIENCY;
                    positions[i] = Vectors.sum(positions[i], Vectors.scaleTo(
                        Vectors.difference(a, b), offset));
                    positions[j] = Vectors.sum(positions[j], Vectors.scaleTo(
                        Vectors.difference(b, a), offset));
                }
            }
        }
        for (let i in this.units) {
            Vectors.copyTo(positions[i], this.units[i]);
        }
    }

    resolveAttacks() {
        for (let i = 0; i < this.units.length; i++) {
            let a = this.units[i];
            let minDist = Infinity;
            let nearestEnemy;
            for (let j = 0; j < this.units.length; j++) {
                if (i == j) continue;
                let b = this.units[j];
                const dist = Vectors.dist(a, b);
                if (dist < minDist && a.canAttackUnit(b)) {
                    minDist = dist;
                    nearestEnemy = b;
                }
            }
            if (minDist === Infinity) {
                a.stopAttacking();
            } else {
                a.isAttacking = true;
                a.attack(nearestEnemy);
            }
        }
        this.units = this.units.filter(unit => unit.enabled);
    }
}
