import GameMap from "../shared/game-map";
import Player from "./player";
import Game from "../shared/game";


export default class Lobby {
  public static count: number = 0;

  id: string;
  name: string;

  map: GameMap;
  players: Player[];

  game?: Game;
  gameInterval?: NodeJS.Timeout;
  started: boolean;

  onStartGame: () => void;
  onUpdateGame: () => void;
  onStopGame: () => void;

  constructor(map: GameMap) {
    this.id = (Lobby.count++).toString();
    this.name = "";

    this.map = map;
    this.game = new Game();
    this.game.init(map);
    this.started = false;

    this.players = [];
  }

  toJSON() {
    const {
      id,
      name,
      map,
      players,
    } = this;
    return {
      id,
      name,
      map,
      players,
      maxPlayers: 4
    }
  }

  addPlayer(player: Player, team: number = 1) {
    this.players.push(player);
    if (this.name === "") this.name = `${player.id}'s game`;
    player.team = team;
  }

  removePlayer({ id }: Player) {
    this.players = this.players.filter(player => player.id !== id);
  }

  setPlayerTeam({ id }: Player, team: number) {
    this.players.find(player => player.id == id).team = team;
  }

  startGame() {
    this.onStartGame();
    this.gameInterval = setInterval(() => {
      this.game.update(1);
      this.onUpdateGame();
    }, 1000 / 60);
    this.started = true;
  }

  stopGame() {
    clearInterval(this.gameInterval);
    delete this.gameInterval;
    this.started = false;
    this.onStopGame();
  }
}
