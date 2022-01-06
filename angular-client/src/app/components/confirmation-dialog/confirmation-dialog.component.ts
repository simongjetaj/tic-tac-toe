import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IGameState } from 'shared/interfaces/game.interface';
import { GameService } from 'src/app/services/game.service';
import { SocketService } from 'src/app/services/socket.service';
import { SharedStoreService } from 'src/app/store/shared-store.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  gameState: IGameState = {} as IGameState;
  confirmMessage: string = '';
  nonWinnerMsg: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private socketService: SocketService,
    private toastrService: ToastrService,
    private sharedStoreService: SharedStoreService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.sharedStoreService.gameState$.subscribe((gameState) => {
        this.gameState = gameState;
      })
    );
  }

  cancel() {
    this.gameService.leaveGame(
      this.socketService.socket,
      this.sharedStoreService.initialState
    );
  }

  confirm() {
    if (this.nonWinnerMsg) {
      this.gameService.requestNewGame(
        this.socketService.socket,
        this.gameState
      );
      this.toastrService.clear();
    } else {
      this.gameService.restartGame(this.socketService.socket, this.gameState);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription?.unsubscribe()
    );
  }
}
