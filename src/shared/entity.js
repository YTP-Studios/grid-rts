import { Team } from '../teams';

export interface Entity implements Vector {
    team: Team;
    size: number;
    health: number;
}
