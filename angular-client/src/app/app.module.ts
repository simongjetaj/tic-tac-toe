import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { GameComponent } from './components/game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { SquareComponent } from './components/square/square.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

const appRoutes: Routes = [
  { path: '', component: RoomComponent },
  { path: 'game', component: GameComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    GameComponent,
    SquareComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      disableTimeOut: true,
      closeButton: true,
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
