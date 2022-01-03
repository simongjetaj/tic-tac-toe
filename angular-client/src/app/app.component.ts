import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfigService } from './providers/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
