import * as PIXI from 'pixi.js'

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
            unit.x += horizontal_velocity;
            if (horizontal_velocity > -2) {
                horizontal_velocity -= 0.05;
            }
        } else {
            unit.x += horizontal_velocity;
            if (horizontal_velocity < 2) {
                horizontal_velocity += 0.05;
            }
        }
        if (unit.y > mouseposition.y) {
            unit.y += vertical_velocity;
            if (vertical_velocity > -2) {
                vertical_velocity -= 0.05;
            }
        } else {
            unit.y += vertical_velocity;
            if (vertical_velocity < 2) {
                vertical_velocity += 0.05;
            }
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
