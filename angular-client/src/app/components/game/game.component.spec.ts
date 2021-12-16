import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { GameComponent } from './game.component';
import { MatDialogModule } from '@angular/material/dialog';

const toastrService = {
  success: (message?: string, title?: string) => {},
  error: (message?: string, title?: string) => {},
};

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ToastrService,
          useValue: toastrService,
        },
      ],
      imports: [RouterTestingModule, MatDialogModule, ToastrModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test the main logic of tic tac toe game', () => {
    expect(
      component.isSolved([
        ['x', '', 'x'],
        ['x', 'o', 'o'],
        ['x', 'o', 'o'],
      ])
    ).toEqual(1);

    expect(
      component.isSolved([
        ['x', '', 'x'],
        ['x', 'o', 'o'],
        ['o', 'o', 'o'],
      ])
    ).toEqual(2);

    expect(
      component.isSolved([
        ['x', '', 'o'],
        ['x', 'o', 'o'],
        ['o', 'x', 'o'],
      ])
    ).toEqual(2);

    expect(
      component.isSolved([
        ['x', 'o', 'o'],
        ['x', 'x', 'o'],
        ['o', 'x', 'x'],
      ])
    ).toEqual(1);

    expect(
      component.isSolved([
        ['x', 'o', 'o'],
        ['x', 'o', 'o'],
        ['o', 'x', 'x'],
      ])
    ).toEqual(2);

    expect(
      component.isSolved([
        ['x', 'o', 'x'],
        ['x', 'o', 'o'],
        ['o', 'x', 'x'],
      ])
    ).toEqual(0);

    expect(
      component.isSolved([
        ['x', '', 'x'],
        ['x', '', 'o'],
        ['o', '', 'x'],
      ])
    ).toEqual(-1);

    expect(
      component.isSolved([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ])
    ).toEqual(-1);

    expect(
      component.isSolved([
        ['x', 'x', 'x'],
        ['x', 'x', 'x'],
        ['x', 'x', 'x'],
      ])
    ).toEqual(1);

    expect(
      component.isSolved([
        ['o', 'o', 'o'],
        ['o', 'o', 'o'],
        ['o', 'o', 'o'],
      ])
    ).toEqual(2);

    expect(
      component.isSolved([
        ['o', 'x', 'x'],
        ['x', 'x', 'o'],
        ['o', 'o', 'x'],
      ])
    ).toEqual(0);
  });
});
