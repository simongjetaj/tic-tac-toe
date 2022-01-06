import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IGameState } from 'src/app/interfaces/game.interface';
import { GameService } from 'src/app/services/game.service';
import { SocketService } from 'src/app/services/socket.service';
import { SharedStoreService } from 'src/app/store/shared-store.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  setJoining: boolean = false;
  gameState: IGameState = {} as IGameState;

  roomForm = new FormGroup({
    roomId: new FormControl(''),
  });

  subscriptions: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private gameService: GameService,
    private sharedStoreService: SharedStoreService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (!navigation) {
      return;
    }

    const message = navigation.extras?.state?.message;

    if (!message) {
      return;
    }

    this.toastrService.info(message);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.sharedStoreService.gameState$.subscribe(
        (gameState: IGameState) => (this.gameState = gameState)
      )
    );
  }

  async onStartGame() {
    this.toastrService.clear();
    this.setJoining = true;

    const gameState = await this.gameService
      .joinGameRoom(this.socketService.socket, {
        ...this.sharedStoreService.initialState,
        roomId: this.roomForm.value.roomId,
      })
      .catch((err) => {
        alert(err);
      });

    if ((gameState as IGameState).isInRoom) {
      this.setJoining = false;
      this.sharedStoreService.setGameSate(gameState as IGameState);
      this.router.navigate(['/game']);
    }

    this.roomForm.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription?.unsubscribe()
    );
  }
}
