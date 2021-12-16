import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStatus, IGameState } from 'src/app/interfaces/game.interface';
import { GameService } from 'src/app/services/game.service';
import { SocketService } from 'src/app/services/socket.service';
import { SharedStoreService } from 'src/app/store/shared-store.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {
  gameState: IGameState = {} as IGameState;
  title = 'Tic Tac Toe';
  dialogRef: MatDialogRef<ConfirmationDialogComponent> | undefined;
  subscriptions: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private sharedStoreService: SharedStoreService,
    private gameService: GameService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.sharedStoreService.gameState$.subscribe((gameState) => {
        this.gameState = gameState;
      })
    );

    if (this.socketService.socket) {
      this.gameService.onGameStarted(
        this.socketService.socket,
        (startGame: boolean) => {
          this.gameState = {
            ...this.gameState,
            isGameStarted: true,
            isPlayerTurn: startGame,
          };
          this.sharedStoreService.setGameSate(this.gameState as IGameState);
        }
      );

      this.gameService.onGameUpdated(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.sharedStoreService.setGameSate(gameState as IGameState);
        }
      );

      this.gameService.onGameLost(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.sharedStoreService.setGameSate(gameState as IGameState);
          const message =
            gameState.status === GameStatus.Won
              ? 'Losing provides wisdom!'
              : "It's a draw!";
          this.toastrService.warning(message, '😉');

          setTimeout(() => {
            this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
            this.dialogRef.componentInstance.confirmMessage =
              'Would you like to start a new game?';
            this.dialogRef.componentInstance.nonWinnerMsg = true;
          }, 2000);
        }
      );

      this.gameService.onGameWon(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.sharedStoreService.setGameSate(gameState as IGameState);
          this.toastrService.success('Sei bravissimo, you won!', '😎');
        }
      );

      this.gameService.onGameDraw(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.sharedStoreService.setGameSate(gameState as IGameState);
          this.toastrService.warning("It's a draw!", '😉');
        }
      );

      this.gameService.onGameRequested(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.dialogRef = this.dialog.open(ConfirmationDialogComponent);
          this.dialogRef.componentInstance.confirmMessage =
            'The other player has requested a new game, would you like to play again?';
          this.dialogRef.componentInstance.winnerMsg = true;

          this.sharedStoreService.setGameSate(gameState);
        }
      );

      this.gameService.onGameRestarted(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.sharedStoreService.setGameSate(gameState);
          this.toastrService.clear();
        }
      );

      this.gameService.onGameLeft(
        this.socketService.socket,
        (gameState: IGameState) => {
          this.toastrService.clear();
          this.sharedStoreService.setGameSate(gameState);
          this.router.navigate([''], {
            state: {
              message: 'Leaving the game because one of you left the game',
            },
          });
        }
      );
    }
  }

  updateMatrixBoard(rowIndex: number, colIndex: number, symbol: 'x' | 'o') {
    const matrix = [...this.gameState.matrix];
    matrix[rowIndex][colIndex] = symbol;
    const result = this.isSolved(matrix);
    const isGameWon = result === 1 || result === 2;
    const isGameDraw = result === 0;

    const newGameState = {
      ...this.gameState,
      matrix,
      playerSymbol: symbol,
    };

    if (isGameWon || isGameDraw) {
      this.gameState = {
        ...newGameState,
        status: isGameWon ? GameStatus.Won : GameStatus.Draw,
      };

      this.gameService.finishGame(this.socketService.socket, this.gameState);
    } else {
      this.gameState = newGameState;
      this.gameService.updateGame(this.socketService.socket, this.gameState);
    }
  }

  isSolved = (board: string[][]) => {
    switch (true) {
      case this.player('x').wins(board):
        return 1;

      case this.player('o').wins(board):
        return 2;

      case this.unfinished(board):
        return -1;

      default:
        return 0;
    }
  };

  disableCell(gameState: IGameState, i: number, j: number) {
    const isWonAndNotRestarted =
      gameState.status === GameStatus.Won && !gameState.isGameRestarted;

    return (
      !gameState.isPlayerTurn ||
      isWonAndNotRestarted ||
      gameState.matrix[i][j] === 'x' ||
      gameState.matrix[i][j] === 'o'
    );
  }

  private horizontal = (player: 'x' | 'o', board: string[][]) =>
    board.some((row) => row.every((spot) => spot == player));

  private vertical = (player: 'x' | 'o', board: string[][]) =>
    board.some((_, i) => board.every((row) => row[i] == player));

  private diagonals = (player: 'x' | 'o', board: string[][]) =>
    board.every((row, i) => row[i] == player) ||
    board.every((row, i) => row[3 - 1 - i] == player);

  private player = (symbol: 'x' | 'o') => ({
    wins: (board: string[][]) =>
      [this.horizontal, this.vertical, this.diagonals].some((full) => {
        return full(symbol, board);
      }),
  });

  private unfinished = (board: string[][]) =>
    board.some((row: string[]) => row.some((spot: string) => !spot));

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription?.unsubscribe()
    );
  }
}
