import * as PIXI from 'pixi.js'
import { ClientUnit } from './client_unit';

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
        new ClientUnit(app.stage, 69, 69),
        new ClientUnit(app.stage, 120, 120),
    ];

    app.ticker.add(delta => gameLoop(delta));
    app.renderer.plugins.interaction.on('mousedown', (event) => {
        let mouseposition = app.renderer.plugins.interaction.mouse.global;
        units.forEach((unit) => {
            unit.targetPos.x = mouseposition.x;
            unit.targetPos.y = mouseposition.y;
        });
    })
}

function gameLoop(delta) {
    units.forEach((unit) => unit.update(delta));
}
