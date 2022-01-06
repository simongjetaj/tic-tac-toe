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

it('should test if the tic tac toe game is hacked', () => {
  expect(
    gameController.isGameHacked(['x', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'])
  ).toEqual(true);

  expect(
    gameController.isGameHacked(['o', 'o', 'o', 'x', 'o', 'x', 'o', 'x', 'o'])
  ).toEqual(true);

  expect(
    gameController.isGameHacked(['o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'])
  ).toEqual(false);

  expect(
    gameController.isGameHacked(['o', 'x', 'o', 'x', 'o', 'x', 'o', 'o', 'o'])
  ).toEqual(true);

  expect(
    gameController.isGameHacked(['o', 'x', 'o', 'x', 'o', 'x', 'x', 'o', 'x'])
  ).toEqual(true);

  expect(
    gameController.isGameHacked(['o', 'x', 'o', 'x', 'o', 'x', 'x', 'o', 'o'])
  ).toEqual(true);

  expect(gameController.isGameHacked([])).toEqual(false);

  expect(gameController.isGameHacked(['x'])).toEqual(false);

  expect(gameController.isGameHacked(['o'])).toEqual(false);
});
