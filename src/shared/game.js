import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import { NEUTRAL } from './teams';
import BasicUnit from './basic_unit';
import SiegeUnit from './siege_unit';

export default class Game {
  init(map, units) {
    this.map = map;
    this.units = units;
    this.energy = [0, 0, 0];
    this.income = [0, 0, 0];
    this.energyCap = [0, 0, 0];
  }

  update(delta) {
    this.map.update(delta);
    this.units.forEach((unit) => unit.update(delta));
    this.resolveCollisions();
    this.resolveAttacks(delta);
    this.updateIncome();
  }

  resolveCollisions() {
    let positions = this.units.map(({ x, y }) => ({ x, y }));
    for (let i = 0; i < this.units.length; i++) {
      for (let j = i + 1; j < this.units.length; j++) {
        let a = this.units[i]; let b = this.units[j];
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

  resolveAttacks(delta) {
    for (let i = 0; i < this.units.length; i++) {
      let foundEnemyInRange = false;
      let enemies = [];
      let a = this.units[i];
      for (let j = 0; j < this.units.length; j++) {
        if (i === j) continue;
        let b = this.units[j];
        if (a.canAttackUnit(b))
          foundEnemyInRange = true;
        if (a.team !== b.team && b.team !== NEUTRAL)
          enemies.push(b);
      }
      if (!foundEnemyInRange) {
        for (let j = 0; j < this.map.buildings.length; j++) {
          for (let k = 0; k < this.map.buildings[j].length; k++) {
            let b = this.map.buildings[j][k];
            if (!b) continue;
            if (a.canAttackUnit(b))
              foundEnemyInRange = true;
            if (a.team !== b.team && b.team !== NEUTRAL)
              enemies.push(b);
          }
        }
      }
      if (!foundEnemyInRange) {
        a.stopAttacking();
      } else {
        a.isAttacking = true;
        a.attack(enemies, delta);
      }
    }
    this.units = this.units.filter(unit => unit.enabled);
  }

  getState() {
    return {
      units: this.units.map(e => e.getState()),
      map: this.map.getState(),
    };
  }

  instantiate(data) {
    if (data.type.startsWith('unit')) {
      let unit;
      switch (data.type) {
        case 'unit:basic_unit':
          unit = new BasicUnit(data.x, data.y, data.team);
          break;
        case 'unit:siege_unit':
          unit = new SiegeUnit(data.x, data.y, data.team);
          break;
        default:
          throw new Error('Undefined unit type.');
      }
      return unit;
    }
  }

  setState({ units: unitsData, map }) {
    // Remove missing units
    let toRemove = this.units.filter(unit => !unitsData.some(e => e.id === unit.id));
    toRemove.forEach(e => e.destroy());
    this.units = this.units.filter(u => !toRemove.includes(u));
    // Update existing units
    this.units.forEach((unit) => {
      const data = unitsData.find(e => (e.id === unit.id));
      unit.setState(data);
    });

    // Add new units
    this.units = this.units.concat(unitsData
      .filter(e => !this.units.some(unit => unit.id === e.id))
      .map(data => this.instantiate(data)));

    // Update map
    this.map.setState(map);
  }

  updateIncome() {
    for (let i = 0; i < this.energy.length; i++) {
      this.income[i] = 0;
      this.energyCap[i] = 0;
      for (let j = 0; j < this.map.buildings.length; j++) {
        for (let k = 0; k < this.map.buildings[j].length; k++) {
          const building = this.map.buildings[j][k];
          if (!building) continue;
          if (building.team === i) {
            this.income[i] += building.getIncome();
            this.energyCap[i] += building.getEnergyCap();
          }
        }
      }
      this.energy[i] += this.income[i];
      this.energy[i] = Math.min(this.energy[i], this.energyCap[i]);
    }
  }
}
