import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { IGameState } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {}

  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit('join_game', roomId);
      socket.on('room_joined', () => resolve(true));
      socket.on('room_joined_error', ({ error }) => reject(error));
    });
  }

  public updateGame(socket: Socket, gameState: IGameState) {
    socket.emit('update_game', gameState);
  }

  public finishGame(socket: Socket, gameState: IGameState) {
    socket.emit('finish_game', gameState);
  }

  public restartGame(socket: Socket, gameState: IGameState) {
    socket.emit('restart_game', gameState);
  }

  public requestNewGame(socket: Socket, gameState: IGameState) {
    socket.emit('request_game', gameState);
  }

  public leaveGame(socket: Socket, gameState: IGameState) {
    socket.emit('leave_game', gameState);
  }

  public onGameUpdated(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_updated', (gameState) => cb(gameState));
  }

  public onGameStarted(socket: Socket, cb: (startGame: boolean) => void) {
    socket.on('game_started', (startGame) => cb(startGame));
  }

  public onGameLost(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_lost', (gameState) => cb(gameState));
  }

  public onGameRestarted(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_restarted', (gameState) => cb(gameState));
  }

  public onGameRequested(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_requested', (gameState) => cb(gameState));
  }

  public onGameWon(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_won', (gameState) => cb(gameState));
  }

  public onGameDraw(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_draw', (gameState) => cb(gameState));
  }

  public onGameLeft(socket: Socket, cb: (gameState: IGameState) => void) {
    socket.on('game_left', (gameState) => cb(gameState));
  }
}
