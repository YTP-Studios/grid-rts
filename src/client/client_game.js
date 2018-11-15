import * as PIXI from 'pixi.js'
import { BasicClientUnit } from './basic_client_unit';
import * as Vectors from '../shared/vectors';
import * as Constants from '../shared/constants';
import ClientMap from './client_map';
import { BLUE_TEAM } from '../shared/teams';
import keyboard from './keyboard';
import Game from '../shared/game';

const PLAYER_TEAM = BLUE_TEAM;

export default class ClientGame extends Game {
    static loadAssets() {
        return new Promise(resolve =>
            PIXI.loader
                .add("assets/basic-unit-body.png")
                .add("assets/basic-unit-core.png")
                .add("assets/conduit-edge.png")
                .add("assets/conduit-center.png")
                .load(resolve));

    }

    init() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            antialias: true,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x3B3B3B,
            //backgroundColor: 0xFFC0CB
        });

        document.body.appendChild(this.app.view);

        let upKey = keyboard("ArrowUp");
        let downKey = keyboard("ArrowDown");
        let leftKey = keyboard("ArrowLeft");
        let rightKey = keyboard("ArrowRight");

        this.world = new PIXI.Container();
        this.world.velocity = { x: 0, y: 0 };
        this.app.stage.addChild(this.world);

        let map = ClientMap.fromString(this.world, Constants.DEFAULT_MAP);
        let units = [
            new BasicClientUnit(this.world, Math.random() * 500, Math.random() * 500, BLUE_TEAM),
            new BasicClientUnit(this.world, Math.random() * 500, Math.random() * 500, BLUE_TEAM),
            new BasicClientUnit(this.world, 50, 50),
            new BasicClientUnit(this.world, 500, 500),
        ];
        super.init(map, units);

        upKey.press = () => this.world.velocity.y += Constants.CAMERA_SPEED;
        upKey.release = () => this.world.velocity.y -= Constants.CAMERA_SPEED;
        downKey.press = () => this.world.velocity.y -= Constants.CAMERA_SPEED;
        downKey.release = () => this.world.velocity.y += Constants.CAMERA_SPEED;
        leftKey.press = () => this.world.velocity.x += Constants.CAMERA_SPEED;
        leftKey.release = () => this.world.velocity.x -= Constants.CAMERA_SPEED;
        rightKey.press = () => this.world.velocity.x -= Constants.CAMERA_SPEED;
        rightKey.release = () => this.world.velocity.x += Constants.CAMERA_SPEED;

        this.app.renderer.plugins.interaction.on('mousedown', () => {
            const mousePosition = this.app.renderer.plugins.interaction.mouse.global;
            units.filter((unit) => unit.team === PLAYER_TEAM).forEach((unit) => {
                const worldPosition = Vectors.difference(mousePosition, this.world)
                Vectors.copyTo(worldPosition, unit.targetPos)
            });
        })

        // // resets the state in 10s
        // let state = this.getState();
        // setTimeout(() => {
        //     this.setState(state);
        // }, 10000);
    }

    start() {
        this.app.ticker.add(delta => this.update(delta));
    }

    update(delta) {
        super.update(delta);
        this.updateCamera(delta);
    }

    updateCamera(delta) {
        Vectors.copyTo(Vectors.sum(this.world, Vectors.scale(this.world.velocity, delta)), this.world);
    }

    instantiate(data) {
        if (data.type.startsWith("unit")) {
            let unit;
            switch (data.type) {
                case "unit:basic_unit":
                    unit = new BasicClientUnit(this.world, data.x, data.y, data.team);
                    break;
                default:
                    throw new Error("Undefined unit type.");
            }
            unit.setState(data);
            return unit;
        }
    }

}
