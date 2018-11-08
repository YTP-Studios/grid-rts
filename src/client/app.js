import * as PIXI from 'pixi.js'
import { ClientUnit } from './client_unit';
import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';

const PLAYER_TEAM = Constants.RED_TEAM;

let app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1,
    //backgroundColor: 0xFFC0CB
});

document.body.appendChild(app.view);

PIXI.loader
    .add("assets/machineTurret.png")
    .load(setup);

let units = [];

function setup() {
    units = [
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500, Constants.RED_TEAM),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500, Constants.RED_TEAM),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
        new ClientUnit(app.stage, Math.random() * 500, Math.random() * 500),
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
    units.forEach((unit) => unit.update(delta));
    resolveCollisions();
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
                positions[i] = Vectors.sum(positions[i], Vectors.scaleTo(Vectors.difference(a, b), offset));
                positions[j] = Vectors.sum(positions[j], Vectors.scaleTo(Vectors.difference(b, a), offset));
            }

        }
    }
    for (let i in units) {
        Vectors.copyTo(positions[i], units[i]);
    }
}
