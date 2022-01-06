export interface IGameState {
  roomId: string;
  isInRoom: boolean;
  playerSymbol: 'x' | 'o';
  status: GameStatus;
  isPlayerTurn: boolean;
  isGameStarted: boolean;
  isGameRequested: boolean;
  isGameRestarted: boolean;
  matrix: string[][];
  history: string[];
}

export interface IConfig {
  SERVER_BASE_URL: string;
}

export enum GameStatus {
  Won = 1,
  Draw = 0,
  Unfinished = -1,
}
