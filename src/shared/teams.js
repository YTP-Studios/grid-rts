
export type Colour = number;
export type Team = number;

export const NEUTRAL_COLOUR: Colour = 0x404040;
export const RED_TEAM_COLOUR: Colour = 0xFF4040;
export const BLUE_TEAM_COLOUR: Colour = 0x3697FF;

export const TEAM_COLOURS = [
  NEUTRAL_COLOUR,
  RED_TEAM_COLOUR,
  BLUE_TEAM_COLOUR,
];

export const DISABLED_RED_TEAM_COLOUR: Colour = 0x772020;
export const DISABLED_BLUE_TEAM_COLOUR: Colour = 0x1A4B77;

export const DISABLED_TEAM_COLOURS = [
  NEUTRAL_COLOUR,
  DISABLED_RED_TEAM_COLOUR,
  DISABLED_BLUE_TEAM_COLOUR,
];

export const NEUTRAL: Team = 0;
export const RED_TEAM: Team = 1;
export const BLUE_TEAM: Team = 2;

export const TEAMS = [
  NEUTRAL,
  RED_TEAM,
  BLUE_TEAM,
];
