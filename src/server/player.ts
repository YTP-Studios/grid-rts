import { Socket } from "socket.io";

export default interface Player {
  id: string;
  username: string;
  team?: number;
}
