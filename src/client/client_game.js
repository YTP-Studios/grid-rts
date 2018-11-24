import { AdvancedBloomFilter } from 'pixi-filters';
import * as PIXI from 'pixi.js';
import { Command, MoveCommand } from '../shared/commands';
import * as Constants from '../shared/constants';
import Game from '../shared/game';
import { COMMAND, GAME_STATE, RESET } from '../shared/game-events';
import { BLUE_TEAM, TEAM_COLOURS } from '../shared/teams';
import * as Vectors from '../shared/vectors';
import { BasicClientUnit } from './basic_client_unit';
import ClientMap from './client_map';
import keyboard from './keyboard';

export default class ClientGame extends Game {
    static loadAssets() {
        return new Promise(resolve =>
            PIXI.loader
                .add("assets/basic-unit-body.png")
                .add("assets/basic-unit-core.png")
                .add("assets/conduit-edge.png")
                .add("assets/conduit-center.png")
                .add("assets/generator-edge.png")
                .add("assets/generator-center.png")
                .add("assets/generator-core.png")
                .load(resolve));

    }

    init(socket) {
        this.socket = socket;
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            antialias: true,
            transparent: false,
            resolution: 1,
            backgroundColor: Constants.BACKGROUND_COLOR,
        });

        document.body.appendChild(this.app.view);


        this.world = new PIXI.Container();
        this.world.velocity = { x: 0, y: 0 };
        this.app.stage.addChild(this.world);

        this.buildingContainer = new PIXI.Container();
        this.unitContainer = new PIXI.Container();
        this.interfaceContainer = new PIXI.Container();
        this.world.addChild(this.buildingContainer);
        this.world.addChild(this.unitContainer);
        this.world.addChild(this.interfaceContainer);

        let bloomFilter = new AdvancedBloomFilter({
            quality: 8,
            pixelSize: 0.5,
        });

        this.buildingContainer.filters = [bloomFilter];
        this.unitContainer.filters = [bloomFilter];

        let map = ClientMap.fromString(this.buildingContainer, Constants.DEFAULT_MAP);
        let units = [
            new BasicClientUnit(this, Math.random() * 500, Math.random() * 500, BLUE_TEAM),
            new BasicClientUnit(this, Math.random() * 500, Math.random() * 500, BLUE_TEAM),
            new BasicClientUnit(this, 50, 50),
            new BasicClientUnit(this, 500, 500),
        ];
        super.init(map, units);

        this.app.view.oncontextmenu = () => false;

        let upKey = keyboard("ArrowUp");
        let downKey = keyboard("ArrowDown");
        let leftKey = keyboard("ArrowLeft");
        let rightKey = keyboard("ArrowRight");

        upKey.press = () => this.world.velocity.y += Constants.CAMERA_SPEED;
        upKey.release = () => this.world.velocity.y -= Constants.CAMERA_SPEED;
        downKey.press = () => this.world.velocity.y -= Constants.CAMERA_SPEED;
        downKey.release = () => this.world.velocity.y += Constants.CAMERA_SPEED;
        leftKey.press = () => this.world.velocity.x += Constants.CAMERA_SPEED;
        leftKey.release = () => this.world.velocity.x -= Constants.CAMERA_SPEED;
        rightKey.press = () => this.world.velocity.x -= Constants.CAMERA_SPEED;
        rightKey.release = () => this.world.velocity.x += Constants.CAMERA_SPEED;

        this.isMouseDown = false;
        this.initialMousePos = { x: 0, y: 0 };

        this.unitSelectorBox = new PIXI.Graphics();
        this.interfaceContainer.addChild(this.unitSelectorBox);
        this.posIndicator = new PIXI.Graphics();
        this.interfaceContainer.addChild(this.posIndicator);

        this.app.renderer.plugins.interaction.on('rightdown', () => {
            const mousePosition = this.app.renderer.plugins.interaction.mouse.global;
            const targetPos = this.world.toLocal(mousePosition)
            this.drawIndicator(targetPos);
            const unitIds = this.units.filter((unit) => unit.team === this.playerTeam && unit.isSelected).map(unit => unit.id);
            const command = new MoveCommand({ targetPos, unitIds });
            socket.emit(COMMAND, Command.toData(command));
            command.exec(this);
        })

        this.app.renderer.plugins.interaction.on('rightup', () => {
            this.posIndicator.clear();
        })

        this.app.renderer.plugins.interaction.on('mousedown', () => {
            this.isMouseDown = true;
            const mousePosition = this.world.toLocal(this.app.renderer.plugins.interaction.mouse.global);
            this.initialMousePos.x = mousePosition.x;
            this.initialMousePos.y = mousePosition.y;
        })

        this.app.renderer.plugins.interaction.on('mouseup', () => {
            this.setUnitSelections();
            this.unitSelectorBox.clear();
            this.isMouseDown = false;
        })

        let resetKey = keyboard("p");
        resetKey.press = () => {
            this.socket.emit(RESET);
        };

        socket.on(GAME_STATE, (data) => {
            this.setState(data);
        })
    }

    start() {
        this.app.ticker.add(delta => this.update(delta));
    }

    update(delta) {
        super.update(delta);
        this.updateCamera(delta);
        if (this.isMouseDown) {
            const mousePosition = this.world.toLocal(this.app.renderer.plugins.interaction.mouse.global);
            this.drawUnitSelectionBox(mousePosition);
        }
    }

    updateCamera(delta) {
        Vectors.copyTo(Vectors.sum(this.world, Vectors.scale(this.world.velocity, delta)), this.world);
    }

    instantiate(data) {
        if (data.type.startsWith("unit")) {
            let unit;
            switch (data.type) {
                case "unit:basic_unit":
                    unit = new BasicClientUnit(this, data.x, data.y, data.team);
                    break;
                default:
                    throw new Error("Undefined unit type.");
            }
            unit.id = data.id;
            unit.setState(data);
            return unit;
        }
    }

    drawUnitSelectionBox(mousePosition) {
        this.unitSelectorBox.clear();
        this.unitSelectorBox.lineStyle(Constants.SELECTOR_BOX_BORDER_WIDTH, TEAM_COLOURS[this.playerTeam]);
        this.unitSelectorBox.beginFill(TEAM_COLOURS[this.playerTeam], Constants.SELECTOR_BOX_OPACITY);
        const width = -this.initialMousePos.x + mousePosition.x;
        const height = -this.initialMousePos.y + mousePosition.y;
        this.unitSelectorBox.drawRect(this.initialMousePos.x,
            this.initialMousePos.y, width, height);
    }

    setUnitSelections() {
        for (let unit of this.units) {
            if (this.isUnitInSelectionBox(unit) && unit.team === this.playerTeam) {
                unit.isSelected = true;
            } else {
                unit.isSelected = false;
            }
        }
    }

    isUnitInSelectionBox(unit) {
        const bounds = this.unitSelectorBox.getLocalBounds();
        const width = Constants.BASIC_UNIT_BODY_SIZE;
        return unit.x >= bounds.x - width && unit.x <= bounds.x + bounds.width + width
            && unit.y >= bounds.y - width && unit.y <= bounds.y + bounds.height + width;
    }

    drawIndicator(mousePosition) {
        this.posIndicator.lineStyle(Constants.POSITION_INDICATOR_LINE_WIDTH, TEAM_COLOURS[this.playerTeam]);
        this.posIndicator.beginFill(TEAM_COLOURS[this.playerTeam], Constants.POSITION_INDICATOR_OPACITY);
        this.posIndicator.drawRoundedRect(mousePosition.x - Constants.POSITION_INDICATOR_DIAMETER/2, 
            mousePosition.y - Constants.POSITION_INDICATOR_DIAMETER/2, Constants.POSITION_INDICATOR_DIAMETER, 
            Constants.POSITION_INDICATOR_DIAMETER, Constants.POSITION_INDICATOR_DIAMETER/2);
        this.posIndicator.drawCircle(mousePosition.x, mousePosition.y, 
            Constants.POSITION_INDICATOR_INNER_RADIUS);
    }
}
