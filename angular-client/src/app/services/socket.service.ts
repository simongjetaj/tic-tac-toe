import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket!: Socket;

  constructor() {}

  public connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(environment.serverBaseUrl);

      if (!this.socket) return reject();

      this.socket.on('connect', () => {
        resolve(this.socket);
      });

      this.socket.on('connect_error', (err) => {
        reject(err);
      });
    });
  }
}
