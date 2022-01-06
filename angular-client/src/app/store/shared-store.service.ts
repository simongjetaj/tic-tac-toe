import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameStatus, IGameState } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedStoreService {
  public initialState: IGameState = {
    roomId: '',
    isInRoom: false,
    playerSymbol: 'x',
    status: GameStatus.Unfinished,
    isPlayerTurn: false,
    isGameStarted: false,
    isGameRequested: false,
    isGameRestarted: false,
    matrix: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
  };

  private gameState = new BehaviorSubject<IGameState>(this.initialState);
  gameState$ = this.gameState.asObservable();

  constructor() {}

  setGameSate(gameState: IGameState): void {
    this.gameState.next(gameState);
  }
}
