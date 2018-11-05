import * as PIXI from 'pixi.js'
let app = new PIXI.Application({ 
    width: 256,
    height: 256,
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
    machineTurret = new PIXI.Sprite(PIXI.loader.resources["assets/machineTurret.png"].texture);
    machineTurret.y = 69;
    machineTurret.x = 69;
    app.stage.addChild(machineTurret);
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
    let mouseposition = app.renderer.plugins.interaction.mouse.global;
    moveUnitToPoint(machineTurret, mouseposition);
}

function moveUnitToPoint(unit, mouseposition) {
    unit.pivot.x = unit.width/2;
    unit.pivot.y = unit.height/2;
    let vertical_distance = mouseposition.y - unit.y;
    let horizontal_distance = mouseposition.x - unit.x
    let angle = Math.atan2(vertical_distance, horizontal_distance) + Math.PI/2 //sprite faces upwards on default so an offset of 90 degrees is needed

    unit.rotation = angle;

    if (!isTouchingMouse(machineTurret, mouseposition)) {
        if (unit.x > mouseposition.x) {
            unit.x -= 1;
        } else {
            unit.x += 1;
        }
        if (unit.y > mouseposition.y) {
            unit.y -= 1;
        } else {
            unit.y += 1;
        }
    }
}

function isTouchingMouse(unit, mouseposition) {
    return mouseposition.x <= unit.x + unit.width/2 && mouseposition.x >= unit.x - unit.width/2      
        && mouseposition.y <= unit.y + unit.height/2 && mouseposition.y >= unit.y - unit.height/2
}

function play(delta) {
}

function end() {
}
