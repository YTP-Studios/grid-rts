
/**
 * The factor by which the collision adjustment is reduced.
 */
export const COLLISION_LENIENCY = 0.3;

export const CONDUIT_SIZE = 10;
export const CONDUIT_HEALTH = 50;

export const GENERATOR_SIZE = 20;
export const GENERATOR_HEALTH = 420;

export const FACTORY_SIZE = 20;
export const FACTORY_HEALTH = 420;

export const CAMERA_SPEED = 4;

export const SELECTOR_BOX_BORDER_WIDTH = 1.5;
export const SELECTOR_BOX_OPACITY = 0.2;

export const SELECTOR_CIRCLE_RADIUS = 5;
export const SELECTOR_CIRCLE_COLOUR = 0xFFFFFF;

export const POSITION_INDICATOR_DIAMETER = 20;
export const POSITION_INDICATOR_LINE_WIDTH = 3;
export const POSITION_INDICATOR_INNER_RADIUS = 1.5;
export const POSITION_INDICATOR_OPACITY = 0.1;

export const BASIC_UNIT_SPEED = 2.0;
export const BASIC_UNIT_RANGE = 200;
export const BASIC_UNIT_SIGHT_RANGE = 256;
export const BASIC_UNIT_BODY_SIZE = 24;
export const BASIC_UNIT_TURRET_LENGTH = 18;
export const BASIC_UNIT_HEALTH = 100;
export const BASIC_UNIT_MAX_TARGETS = 1;

export const SIEGE_UNIT_SPEED = 1.0;
export const SIEGE_UNIT_RANGE = 300;
export const SIEGE_UNIT_SIGHT_RANGE = 512;
export const SIEGE_UNIT_BODY_SIZE = 48;
export const SIEGE_UNIT_TURRET_LENGTH = 18;
export const SIEGE_UNIT_HEALTH = 420;
export const SIEGE_UNIT_MAX_TARGETS = Infinity;
export const SIEGE_UNIT_DAMAGE = 50;
export const SIEGE_UNIT_EXPLOSION_RADIUS = 75;
export const SIEGE_UNIT_COOLDOWN = 75;
export const SIEGE_UNIT_AOE_OPACITY = 0.1;
export const SIEGE_UNIT_ROTATION_RATE = 0.05;

export const LASER_DAMAGE = 0.5;
export const LASER_THICKNESS = 5;

export const BACKGROUND_COLOUR = 0x202020;

export const GRID_SCALE = 64;

export const BUILDING_SIGHT_RANGE = 2 * GRID_SCALE;

export const GENERATOR_INCOME = 0.1;
export const GENERATOR_CAP = 500;

export const CONDUIT_CAP = 20;

export const VS_MAP = `\
...........
. ..222.. .
... ... ...
.0. .F...0.
... .......
.F. .0. .F.
....... ...
.0...F. .0.
... ... ...
. ..111.. .
...........`;
