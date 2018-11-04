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
let mousePosition;

function setup() {
    machineTurret = new PIXI.Sprite(PIXI.loader.resources["assets/machineTurret.png"].texture);
    machineTurret.y = 69;
    machineTurret.x = 69;
    app.stage.addChild(machineTurret);
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
    var mouseposition = app.renderer.plugins.interaction.mouse.global;
    console.log(mouseposition.x)
    goToPos(machineTurret, mouseposition);
}

function goToPos(machineTurret, mouseposition) {
    if (machineTurret.x > mouseposition.x) {
        machineTurret.x -= 1;
    } else {
        machineTurret.x += 1;
    }
    if (machineTurret.y > mouseposition.y) {
      machineTurret.y -= 1;
    } else {
        machineTurret.y += 1;
  }
}


function play(delta) {
}

function end() {
}
