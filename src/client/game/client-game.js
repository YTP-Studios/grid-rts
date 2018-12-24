import * as PIXI from 'pixi.js';
import { AdvancedBloomFilter, AdjustmentFilter } from 'pixi-filters';

import { Command, MoveCommand, CaptureCommand, SpawnCommand } from '../../shared/commands';
import { GRID_SCALE, CAMERA_SPEED, ZOOM_FACTOR, MAX_ZOOM, MIN_ZOOM, ZOOM_SPEED, SELECTOR_BOX_BORDER_WIDTH, SELECTOR_BOX_OPACITY, BASIC_UNIT_BODY_SIZE, POSITION_INDICATOR_LINE_WIDTH, POSITION_INDICATOR_OPACITY, POSITION_INDICATOR_DIAMETER, POSITION_INDICATOR_INNER_RADIUS } from '../../shared/constants';
import Game from '../../shared/game';
import { COMMAND, GAME_STATE, RESET } from '../../shared/game-events';
import { TEAM_COLOURS } from '../../shared/teams';
import { scale, add, zero, copyTo, sub, limit } from '../../shared/vectors';

import { BasicClientUnit } from './basic-client-unit';
import { SiegeClientUnit } from './siege-client-unit';
import ClientMap from './client-map';
import keyboard from './keyboard';
import Factory from '../../shared/factory';

export default class ClientGame extends Game {
  static loadAssets() {
    return new Promise(resolve =>
      PIXI.loader
        .add('assets/cursor.png')
        .add('assets/basic-unit-body.png')
        .add('assets/basic-unit-core.png')
        .add('assets/conduit-edge.png')
        .add('assets/conduit-center.png')
        .add('assets/generator-edge.png')
        .add('assets/generator-center.png')
        .add('assets/generator-core.png')
        .add('assets/factory-edge.png')
        .add('assets/factory-center.png')
        .add('assets/factory-core.png')
        .add('assets/siege-unit-body.png')
        .add('assets/siege-unit-core.png')
        .load(resolve));

  }

  init(socket, mapData, team) {
    this.socket = socket;
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      antialias: true,
      transparent: false,
      resolution: 1,
      backgroundColor: 0x000000,
    });

    document.body.appendChild(this.app.view);
    document.body.style.cursor = 'none';

    this.world = new PIXI.Container();
    this.world.velocity = { x: 0, y: 0 };

    this.oldBuildingContainer = new PIXI.Container();
    this.buildingContainer = new PIXI.Container();
    this.unitContainer = new PIXI.Container();
    this.interfaceContainer = new PIXI.Container();
    this.world.addChild(this.oldBuildingContainer);
    this.world.addChild(this.buildingContainer);
    this.world.addChild(this.unitContainer);
    this.world.addChild(this.interfaceContainer);

    this.overlayContainer = new PIXI.Container();
    this.app.stage.addChild(this.world);
    this.app.stage.addChild(this.overlayContainer);

    let bloomFilter = new AdvancedBloomFilter({
      quality: 8,
      pixelSize: 0.5,
    });

    this.oldBuildingContainer.filters = [
      new AdjustmentFilter({
        brightness: 0.5,
      }),
    ];
    this.buildingContainer.filters = [bloomFilter];
    this.unitContainer.filters = [bloomFilter];

    this.sightRangeTexture = PIXI.RenderTexture.create(10000, 10000);
    this.sightRangeRect = new PIXI.Graphics();
    this.sightRangeRect.beginFill(0x000000);
    this.sightRangeRect.drawRect(-GRID_SCALE, -GRID_SCALE, 10000, 10000);
    this.sightRangeRect.endFill();
    this.sightRangeSprite = new PIXI.Sprite(this.sightRangeTexture);
    this.sightRangeSprite.position.set(-GRID_SCALE, -GRID_SCALE);

    this.world.addChild(this.sightRangeSprite);
    this.buildingContainer.mask = this.sightRangeSprite;
    this.unitContainer.mask = this.sightRangeSprite;

    let map = ClientMap.fromString(this, mapData);
    super.init(map);
    this.map.allBuildings().forEach(b => b.oldBuildingSprite.update());
    this.playerTeam = team;

    const playerBuildings = this.map.allBuildings()
      .filter(b => b.team === this.playerTeam);
    const averagePos = scale(playerBuildings.reduce(add, zero()), -1 / playerBuildings.length);
    const centerPos = add(averagePos, { x: this.app.screen.width / 2, y: this.app.screen.height / 2 });
    copyTo(centerPos, this.world);

    this.cursor = new PIXI.Sprite(PIXI.loader.resources['assets/cursor.png'].texture);
    this.cursor.width = 16;
    this.cursor.height = 16;
    this.overlayContainer.addChild(this.cursor);

    this.app.view.addEventListener('click', () => {
      this.app.view.requestPointerLock();
    });
    this.app.view.oncontextmenu = () => false;
    this.app.view.addEventListener('mousemove', (e) => {
      const sensitivity = 0.5;
      const offsetX = e.movementX * sensitivity;
      const offsetY = e.movementY * sensitivity;
      if (document.pointerLockElement === this.app.view) {
        this.cursor.x += offsetX;
        this.cursor.y += offsetY;
      } else {
        this.cursor.x = e.offsetX;
        this.cursor.y = e.offsetY;
      }
      if (this.cursor.x <= 0 || this.cursor.x >= this.app.screen.width ||
        this.cursor.y <= 0 || this.cursor.y >= this.app.screen.height) {
        this.world.x -= offsetX * this.world.scale.x;
        this.world.y -= offsetY * this.world.scale.y;
        this.cursor.x = Math.max(this.cursor.x, 0);
        this.cursor.x = Math.min(this.cursor.x, this.app.screen.width);
        this.cursor.y = Math.max(this.cursor.y, 0);
        this.cursor.y = Math.min(this.cursor.y, this.app.screen.height);
      }
    }, false);


    let upKey = keyboard('ArrowUp');
    let downKey = keyboard('ArrowDown');
    let leftKey = keyboard('ArrowLeft');
    let rightKey = keyboard('ArrowRight');
    let shiftKey = keyboard('Shift');

    upKey.press = () => { this.world.velocity.y += CAMERA_SPEED; };
    upKey.release = () => { this.world.velocity.y = 0; };
    downKey.press = () => { this.world.velocity.y -= CAMERA_SPEED; };
    downKey.release = () => { this.world.velocity.y = 0; };
    leftKey.press = () => { this.world.velocity.x += CAMERA_SPEED; };
    leftKey.release = () => { this.world.velocity.x = 0; };
    rightKey.press = () => { this.world.velocity.x -= CAMERA_SPEED; };
    rightKey.release = () => { this.world.velocity.x = 0; };

    let prevSelectedUnits;
    shiftKey.press = () => {
      this.map.allBuildings()
        .filter(b => b instanceof Factory)
        .filter(b => b.team === this.playerTeam)
        .forEach(b => { b.spawnCircle.visible = true; });
      prevSelectedUnits = this.units
        .filter(unit => unit.team === this.playerTeam)
        .filter(unit => unit.isSelected);
      prevSelectedUnits.forEach(unit => { unit.isSelected = false; });
    };
    shiftKey.release = () => {
      this.map.allBuildings()
        .filter(b => b instanceof Factory)
        .forEach(b => { b.spawnCircle.visible = false; });
      prevSelectedUnits.forEach(unit => { unit.isSelected = true; });
      prevSelectedUnits = [];
    };

    this.isMouseDown = false;
    this.initialMousePos = { x: 0, y: 0 };

    this.unitSelectorBox = new PIXI.Graphics();
    this.interfaceContainer.addChild(this.unitSelectorBox);
    this.posIndicator = new PIXI.Graphics();
    this.posIndicator.lineStyle(POSITION_INDICATOR_LINE_WIDTH, TEAM_COLOURS[this.playerTeam]);
    this.posIndicator.beginFill(TEAM_COLOURS[this.playerTeam], POSITION_INDICATOR_OPACITY);
    this.posIndicator.drawRoundedRect(-POSITION_INDICATOR_DIAMETER / 2,
      -POSITION_INDICATOR_DIAMETER / 2, POSITION_INDICATOR_DIAMETER,
      POSITION_INDICATOR_DIAMETER, POSITION_INDICATOR_DIAMETER / 2);
    this.posIndicator.drawCircle(0, 0, POSITION_INDICATOR_INNER_RADIUS);
    this.interfaceContainer.addChild(this.posIndicator);


    const style = new PIXI.TextStyle({
      fontFamily: 'Arial Black', fontSize: 20, fontVariant: 'small-caps', letterSpacing: 2,
      fill: 0xffffff, lineJoin: 'round', strokeThickness: 1,
    });

    this.energyText = new PIXI.Text('', style);
    this.energyText.x = 525;
    this.energyText.y = 10;
    this.app.stage.addChild(this.energyText);

    this.zoomScale = 1;
    document.addEventListener('wheel', (event: WheelEvent) => {
      const delta = event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      this.zoomScale *= delta;
      this.zoomScale = Math.max(Math.min(this.zoomScale, MAX_ZOOM), MIN_ZOOM);
    });

    this.app.renderer.plugins.interaction.on('rightdown', (event) => {
      const mousePosition = this.cursor.position;
      const targetPos = this.world.toLocal(mousePosition);
      this.drawIndicator(targetPos);

      if (event.data.originalEvent.shiftKey) {
        const hasFactory = this.map.allBuildings()
          .filter(b => b instanceof Factory)
          .some(b => b.team === this.playerTeam);
        if (hasFactory) {
          const { x, y } = targetPos;
          const command = new SpawnCommand({
            unit: { type: 'unit:basic_unit', x, y, team: this.playerTeam },
          });
          if (command.validate(this, this.playerTeam)) {
            socket.emit(COMMAND, Command.toData(command));
            command.exec(this);
          }
        }
      } else {
        const selectedUnits = this.units
          .filter(unit => unit.team === this.playerTeam)
          .filter(unit => unit.isSelected);
        if (selectedUnits.length > 0) {
          const command = new MoveCommand({ targetPos, unitIds: selectedUnits.map(unit => unit.id) });
          if (command.validate(this, this.playerTeam)) {
            socket.emit(COMMAND, Command.toData(command));
            command.exec(this);
          }
          return;
        }

        this.capturing = true;
      }
    });

    this.app.renderer.plugins.interaction.on('rightup', () => {
      this.posIndicator.visible = false;
      this.capturing = false;
    });

    this.app.renderer.plugins.interaction.on('mousedown', () => {
      this.isMouseDown = true;
      const mousePosition = this.world.toLocal(this.cursor.position);
      this.initialMousePos.x = mousePosition.x;
      this.initialMousePos.y = mousePosition.y;
      const row = Math.round(mousePosition.y / GRID_SCALE);
      const col = Math.round(mousePosition.x / GRID_SCALE);
      for (let j = 0; j < this.map.buildings.length; j++) {
        for (let k = 0; k < this.map.buildings[j].length; k++) {
          let b = this.map.buildings[j][k];
          if (!b) continue;
          b.isSelected = false;
        }
      }
      const building = this.map.getBuilding(row, col);
      if (building) {
        if (building.team === this.playerTeam) {
          building.isSelected = true;
        }
      }
    });

    this.app.renderer.plugins.interaction.on('mouseup', () => {
      this.setUnitSelections();
      this.unitSelectorBox.clear();
      this.isMouseDown = false;
    });

    let resetKey = keyboard('p');
    resetKey.press = () => {
      this.socket.emit(RESET);
    };

    socket.on(GAME_STATE, (data) => {
      this.setState(data);
    });
  }

  start() {
    this.app.ticker.add(delta => this.update(delta));
  }

  update(delta) {
    this.updateSightRanges();
    super.update(delta);
    this.updateCamera(delta);
    if (this.isMouseDown) this.drawUnitSelectionBox();
    if (this.capturing) this.updateCapture();
    this.drawEnergyText();
  }

  updateCapture() {
    const targetPos = this.world.toLocal(this.cursor.position);
    const row = Math.round(targetPos.y / GRID_SCALE);
    const col = Math.round(targetPos.x / GRID_SCALE);
    const command = new CaptureCommand({ row, col, team: this.playerTeam });
    if (command.validate(this, this.playerTeam)) {
      this.socket.emit(COMMAND, Command.toData(command));
      command.exec(this);
    }
    this.drawIndicator(targetPos);
  }

  updateCamera(delta) {
    // Key camera scrolling
    copyTo(add(this.world, scale(this.world.velocity, delta)), this.world);
    // Mouse zoom update
    const oldPos = this.world.toLocal(this.cursor.position);
    const newScale = Math.pow(this.zoomScale, 1 - ZOOM_SPEED) * Math.pow(this.world.scale.x, ZOOM_SPEED);
    this.world.scale.x = newScale;
    this.world.scale.y = newScale;
    const newPos = this.world.toLocal(this.cursor.position);
    const diff = scale(sub(newPos, oldPos), this.world.scale.x);
    copyTo(add(diff, this.world), this.world);

    // Limit camera position to map
    const screenCenter = { x: this.app.screen.width / 2, y: this.app.screen.height / 2 };
    const lowerLimit = sub(screenCenter, scale(this.map.bottomRight, this.world.scale.x));
    const upperLimit = add(screenCenter, scale(this.map.topLeft, this.world.scale.y));
    limit(this.world, lowerLimit, upperLimit);
  }

  updateSightRanges() {
    this.app.renderer.clearRenderTexture(this.sightRangeTexture, 0x000000);
  }

  instantiate(data) {
    if (data.type.startsWith('unit')) {
      let unit;
      switch (data.type) {
        case 'unit:basic_unit':
          unit = new BasicClientUnit(this, data.x, data.y, data.team);
          break;
        case 'unit:siege_unit':
          unit = new SiegeClientUnit(this, data.x, data.y, data.team);
          break;
        default:
          throw new Error('Undefined unit type.');
      }
      unit.id = data.id;
      unit.setState(data);
      return unit;
    }
  }

  drawUnitSelectionBox() {
    const mousePosition = this.world.toLocal(this.cursor.position);
    this.unitSelectorBox.clear();
    this.unitSelectorBox.lineStyle(SELECTOR_BOX_BORDER_WIDTH, TEAM_COLOURS[this.playerTeam]);
    this.unitSelectorBox.beginFill(TEAM_COLOURS[this.playerTeam], SELECTOR_BOX_OPACITY);
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
    const width = BASIC_UNIT_BODY_SIZE;
    return unit.x >= bounds.x - width && unit.x <= bounds.x + bounds.width + width
      && unit.y >= bounds.y - width && unit.y <= bounds.y + bounds.height + width;
  }

  drawIndicator(mousePosition) {
    this.posIndicator.visible = true;
    this.posIndicator.position.copy(mousePosition);
  }

  drawEnergyText() {
    const energy = Math.floor(this.energy[this.playerTeam]);
    const energyCap = this.energyCap[this.playerTeam];
    this.energyText.text = 'Energy: ' + energy + ' / ' + energyCap;
  }
}
