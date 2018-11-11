import * as PIXI from 'pixi.js'
import { ClientUnit } from './client_unit';
import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import ClientConduit from './client_conduit';
import GameMap from '../shared/game_map';
import ClientMap from './client_map';

const PLAYER_TEAM = Constants.BLUE_TEAM;

let app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor: 0x3B3B3B,
    //backgroundColor: 0xFFC0CB
});

document.body.appendChild(app.view);

PIXI.loader
    .add("assets/machineTurret.png")
    .add("assets/conduit-edge.png")
    .add("assets/conduit-center.png")
    .load(setup);

let units = [];
let map;

function setup() {
    map = ClientMap.fromString(app.stage, Constants.DEFAULT_MAP);
    units = [
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500,
            Constants.BLUE_TEAM, Constants.BLUE_TEAM_COLOR),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500,
            Constants.BLUE_TEAM, Constants.BLUE_TEAM_COLOR),
        new ClientUnit(app.stage, 50, 50),
        new ClientUnit(app.stage, 500, 500),

    ];

    app.ticker.add(delta => gameLoop(delta));
    app.renderer.plugins.interaction.on('mousedown', (event) => {
        let mouseposition = app.renderer.plugins.interaction.mouse.global;
        units.filter((unit) => unit.team === PLAYER_TEAM).forEach((unit) => {
            unit.targetPos.x = mouseposition.x;
            unit.targetPos.y = mouseposition.y;
        });
    })
}

function gameLoop(delta) {
    map.update(delta);
    units.forEach((unit) => unit.update(delta));
    resolveCollisions();
    resolveAttacks();
}

function resolveCollisions() {
    let positions = units.map(({ x, y }) => ({ x, y }));
    for (let i = 0; i < units.length; i++) {
        for (let j = i + 1; j < units.length; j++) {
            let a = units[i], b = units[j];
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
    for (let i in units) {
        Vectors.copyTo(positions[i], units[i]);
    }
}

function resolveAttacks() {
    for (let i = 0; i < units.length; i++) {
        let a = units[i];
        let minDist = Number.MAX_VALUE;
        let nearestEnemy;
        for (let j = 0; j < units.length; j++) {
            if (i == j) continue;
            let b = units[j];
            const dist = Vectors.dist(a, b);
            if (dist < minDist && a.canAttackUnit(b)) {
                minDist = dist;
                nearestEnemy = b;
            }
        }
        if (minDist == Number.MAX_VALUE) {
            a.isAttacking = false;
            a.laser.clear();
        } else {
            a.isAttacking = true;
            a.attack(nearestEnemy);
        }
    }
}
