import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { GameComponent } from './components/game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { SquareComponent } from './components/square/square.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { AppConfigService } from './providers/app-config.service';

const appRoutes: Routes = [
  { path: '', component: RoomComponent },
  { path: 'game', component: GameComponent },
];

export function initConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}

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
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      disableTimeOut: true,
      closeButton: true,
      preventDuplicates: true,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
