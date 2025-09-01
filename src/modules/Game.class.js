'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  // Tabuleiro Inicial
  constructor(boardId, scoreId, buttonId) {
    this.boardElement = document.getElementById(boardId);
    this.scoreElement = document.getElementById(scoreId);
    this.startButton = document.getElementById(buttonId);

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';

    this.setupInput();
    this.setupButton();
  }

  // Metodo para encontrar celulas vazias
  findEmptyCells() {
    const empytCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          empytCells.push([i, j]);
        }
      }
    }

    return empytCells;
  }

  // Metodo para adcionar valores no inicio do jogo
  addRandomTile() {
    const empytCells = this.findEmptyCells();

    if (empytCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * empytCells.length);
      const [row, col] = empytCells[randomIndex];

      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.board[row][col] = newValue;
    }

    return empytCells;
  }

  // Metodo para renderizar o jogo
  render() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        // Acessa a celula corrspondente no html
        const cell = this.boardElement.rows[i].cells[j];
        const value = this.board[i][j];

        // Limpa o conteudo e estilo da celula
        cell.textContent = '';
        cell.className = 'field-cell';

        // Se o valor não for 0, preencha a celula.
        if (value !== 0) {
          cell.textContent = value;

          cell.classList.add('field-cell--%cell_' + value);
        }
      }
    }
  }

  // Metodo para iniciar o jogo
  startGame() {
    // Prepara os dados
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.startButton.textContent = 'Restart';

    // Add as 2 peças inicias do jogo
    this.addRandomTile();
    this.addRandomTile();

    // Desenha na tela
    this.render();
    this.updateScore();
  }

  setupInput() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
      }
    });
  }

  // Metodo para movimentar para a esquerda
  moveLeft() {
    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      const originalRow = [...this.board[i]];
      const newRow = this.processRow(originalRow);

      this.board[i] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(this.board[i])) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
      this.render();

      if (this.checkGameWin()) {
        setInterval(() => {
          alert('Congratulations! You reached 2048!');
        }, 200);
      }
    } else {
      this.checkForGameOver();
    }
  }

  // Metodo para movimentar para a direita
  moveRight() {
    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      const originalRow = [...this.board[i]];
      const reversedRow = [...originalRow].reverse();
      const processedRow = this.processRow(reversedRow);
      const newRow = processedRow.reverse();

      this.board[i] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(this.board[i])) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
      this.render();

      if (this.checkGameWin()) {
        setInterval(() => {
          alert('Congratulations! You reached 2048!');
        }, 200);
      }
    } else {
      this.checkForGameOver();
    }
  }

  // Metodo para movimentar para cima
  moveUp() {
    const originalBoard = JSON.stringify(this.board);

    this.transpose();
    this.moveLeft();
    this.transpose();

    if (originalBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.render();

      if (this.checkGameWin()) {
        setInterval(() => {
          alert('Congratulations! You reached 2048!');
        }, 200);
      }
    } else {
      this.checkForGameOver();
    }
  }

  // Metodo para movimentar para baixo
  moveDown() {
    const originalBoard = JSON.stringify(this.board);

    this.transpose();
    this.moveRight();
    this.transpose();

    if (originalBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.render();

      if (this.checkGameWin()) {
        setInterval(() => {
          alert('Congratulations! You reached 2048!');
        }, 200);
      }
    } else {
      this.checkForGameOver();
    }
  }

  // Metodo para processar a logica de movimento
  processRow(row) {
    // Gera o slide da linha
    let newRow = row.filter((cell) => cell !== 0);

    for (let j = 0; j < newRow.length - 1; j++) {
      if (newRow[j] === newRow[j + 1]) {
        newRow[j] *= 2;
        this.score += newRow[j];
        this.updateScore();
        newRow[j + 1] = 0;
      }
    }

    newRow = newRow.filter((r) => r !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  // Metodo para transpor a matriz
  transpose() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }

    this.board = newBoard;
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
  }

  checkForGameOver() {
    // Se houver espaças vazios o jogo ainda não acabaou
    if (this.findEmptyCells().length > 0) {
      return false;
    }

    // Procura por possivéis fusões
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        const currentCell = this.board[i][j];

        // Checa o vizinho da direita
        if (j < 3 && currentCell[i][j + 1]) {
          return false;
        }

        // Checa o vizinho de baixo
        if (i < 3 && this.board[i + 1][j]) {
          return false;
        }
      }
    }

    // Se o tabuleiro está cheio e não há mais fusões, game over!
    return true;
  }

  // Metodo para checar se o usuario venceu
  checkGameWin() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  // Metodo para resetar o jogo
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  // Metodo para setar o botão de start
  setupButton() {
    this.startButton.addEventListener('click', () => {
      this.startGame();
    });
  }
}

module.exports = Game;
