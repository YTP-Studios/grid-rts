import * as PIXI from 'pixi.js'
import { ClientUnit } from './client_unit';

let horizontal_velocity = 0;
let vertical_velocity = 0;

let app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
    transparent: false,
    resolution: 1,
    //backgroundColor: 0xFFC0CB
}
);

document.body.appendChild(app.view);

PIXI.loader
    .add("assets/machineTurret.png")
    .load(setup);

let machineTurret;

function setup() {
    let machineTurretSprite = new PIXI.Sprite(PIXI.loader.resources["assets/machineTurret.png"].texture);
    machineTurretSprite.pivot.x = machineTurretSprite.width / 2;
    machineTurretSprite.pivot.y = machineTurretSprite.height / 2;
    machineTurret = new ClientUnit(machineTurretSprite, 69, 69);
    app.stage.addChild(machineTurretSprite);
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    let mouseposition = app.renderer.plugins.interaction.mouse.global;
    machineTurret.targetPos.x = mouseposition.x;
    machineTurret.targetPos.y = mouseposition.y;
    machineTurret.update(delta);
}
