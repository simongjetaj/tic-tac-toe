const gameController = require('../api/controllers/game.controller');

it('should test the main logic of tic tac toe game', () => {
  expect(
    gameController.isSolved([
      ['x', '', 'x'],
      ['x', 'o', 'o'],
      ['x', 'o', 'o'],
    ])
  ).toEqual(1);

  expect(
    gameController.isSolved([
      ['x', '', 'x'],
      ['x', 'o', 'o'],
      ['o', 'o', 'o'],
    ])
  ).toEqual(2);

  expect(
    gameController.isSolved([
      ['x', '', 'o'],
      ['x', 'o', 'o'],
      ['o', 'x', 'o'],
    ])
  ).toEqual(2);

  expect(
    gameController.isSolved([
      ['x', 'o', 'o'],
      ['x', 'x', 'o'],
      ['o', 'x', 'x'],
    ])
  ).toEqual(1);

  expect(
    gameController.isSolved([
      ['x', 'o', 'o'],
      ['x', 'o', 'o'],
      ['o', 'x', 'x'],
    ])
  ).toEqual(2);

  expect(
    gameController.isSolved([
      ['x', 'o', 'x'],
      ['x', 'o', 'o'],
      ['o', 'x', 'x'],
    ])
  ).toEqual(0);

  expect(
    gameController.isSolved([
      ['x', '', 'x'],
      ['x', '', 'o'],
      ['o', '', 'x'],
    ])
  ).toEqual(-1);

  expect(
    gameController.isSolved([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ])
  ).toEqual(-1);

  expect(
    gameController.isSolved([
      ['x', 'x', 'x'],
      ['x', 'x', 'x'],
      ['x', 'x', 'x'],
    ])
  ).toEqual(1);

  expect(
    gameController.isSolved([
      ['o', 'o', 'o'],
      ['o', 'o', 'o'],
      ['o', 'o', 'o'],
    ])
  ).toEqual(2);

  expect(
    gameController.isSolved([
      ['o', 'x', 'x'],
      ['x', 'x', 'o'],
      ['o', 'o', 'x'],
    ])
  ).toEqual(0);
});
