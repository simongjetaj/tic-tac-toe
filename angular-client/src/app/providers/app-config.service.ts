import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from 'src/app/services/socket.service';
import { IConfig } from 'src/app/interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  public loadConfig() {
    return this.http.get<IConfig>('./assets/config/config.json').subscribe({
      next: (config: IConfig) => {
        this.socketService.connect(config.SERVER_BASE_URL);
      },
      error: (err) => console.error(err),
    });
  }
}
