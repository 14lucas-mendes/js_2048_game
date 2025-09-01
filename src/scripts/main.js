'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game('game-header', 'game-score', 'start');

// Write your code here
game.startButton.addEventListener('click', () => {
  game.startGame();
});
