import * as PIXI from 'pixi.js'
import { ClientUnit } from './client_unit';
import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import ClientMap from './client_map';
import { BLUE_TEAM } from '../shared/teams';
import keyboard from './keyboard';

const PLAYER_TEAM = BLUE_TEAM;

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
    .add("assets/basic-unit-body.png")
    .add("assets/basic-unit-core.png")
    .add("assets/conduit-edge.png")
    .add("assets/conduit-center.png")
    .load(setup);

let units = [];
let map;
let world;

let upKey = keyboard("ArrowUp");
let downKey = keyboard("ArrowDown");
let leftKey = keyboard("ArrowLeft");
let rightKey = keyboard("ArrowRight");

function setup() {
    world = new PIXI.Container();
    world.velocity = { x: 0, y: 0 };
    app.stage.addChild(world);

    upKey.press = () => world.velocity.y += Constants.CAMERA_SPEED;
    upKey.release = () => world.velocity.y -= Constants.CAMERA_SPEED;
    downKey.press = () => world.velocity.y -= Constants.CAMERA_SPEED;
    downKey.release = () => world.velocity.y += Constants.CAMERA_SPEED;
    leftKey.press = () => world.velocity.x += Constants.CAMERA_SPEED;
    leftKey.release = () => world.velocity.x -= Constants.CAMERA_SPEED;
    rightKey.press = () => world.velocity.x -= Constants.CAMERA_SPEED;
    rightKey.release = () => world.velocity.x += Constants.CAMERA_SPEED;


    map = ClientMap.fromString(world, Constants.DEFAULT_MAP);
    units = [
        new ClientUnit(world, Math.random() * 500, Math.random() * 500, BLUE_TEAM),
        new ClientUnit(world, Math.random() * 500, Math.random() * 500, BLUE_TEAM),
        new ClientUnit(world, 50, 50),
        new ClientUnit(world, 500, 500),
    ];

    app.ticker.add(delta => gameLoop(delta));
    app.renderer.plugins.interaction.on('mousedown', () => {
        const mousePosition = app.renderer.plugins.interaction.mouse.global;
        units.filter((unit) => unit.team === PLAYER_TEAM).forEach((unit) => {
            const worldPosition = Vectors.difference(mousePosition, world)
            Vectors.copyTo(worldPosition, unit.targetPos)
        });
    })
}

function gameLoop(delta) {
    updateCamera(delta);
    map.update(delta);
    units.forEach((unit) => unit.update(delta));
    resolveCollisions();
    resolveAttacks();
    units = units.filter(unit => unit.enabled);
}

function updateCamera(delta) {
    Vectors.copyTo(Vectors.sum(world, Vectors.scale(world.velocity, delta)), world);
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
        let minDist = Infinity;
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
        if (minDist === Infinity) {
            a.stopAttacking();
        } else {
            a.isAttacking = true;
            a.attack(nearestEnemy);
        }
    }
}
