// GameBoard Module
const GameBoard = (function () {
  // 3x3 Board initialized with null values
  let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  // Method to get the current state of the board
  const getBoard = () => board;

  // Method to place a mark on the board
  const placeMark = (row, col, mark) => {
    if (board[row][col] === null) {
      board[row][col] = mark;
      return true;
    }
    return false;
  };

  // Method to print the current state of the board
  const printBoard = () => {
    const printedBoard = board
      .map(
        (row) =>
          `| ${row.map((cell) => (cell === null ? " " : cell)).join(" | ")} |`
      )
      .join("\n-------------\n");
    console.log(printedBoard);
  };

  // Method to reset the board
  const resetBoard = () => {
    board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  };

  return { getBoard, placeMark, resetBoard, printBoard };
})();

// Player Factory Function
const Player = (name, mark) => {
  return { name, mark };
};

// GameController Module
const GameController = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let gameOver = false; // Flag to track game status
  let currentPlayer = player1;
  const board = GameBoard;

  // Method to switch Player after a turn
  const switchPlayer = () => {
    if (!gameOver) {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  };

  // Method to get the board state
  const getBoard = () => board.getBoard();

  // Method to get the current Player
  const getCurrentPlayer = () => currentPlayer;

  // Method to check for a win
  const checkWin = (row, col) => {
    const boardState = board.getBoard();
    const mark = currentPlayer.mark;

    // Check row
    if (boardState[row].every((cell) => cell === mark)) return true;

    // Check column
    if (boardState.every((r) => r[col] === mark)) return true;

    // Check diagonals
    if (row === col && boardState.every((r, idx) => r[idx] === mark))
      return true;
    if (row + col === 2 && boardState.every((r, idx) => r[2 - idx] === mark))
      return true;

    return false;
  };

  // Method to check for a tie
  const checkTie = () => {
    const boardState = board.getBoard();
    const allCellsFilled = boardState.flat().every((cell) => cell !== null);
    return allCellsFilled;
  };

  // Method to reset the game
  const resetGame = () => {
    board.resetBoard();
    gameOver = false;
    currentPlayer = player1;
    console.log(`${currentPlayer.name}'s turn.`);
    DisplayController.updateMessage(`${currentPlayer.name}'s turn.`);
  };

  const checkTiePass = () => {
    return checkTie();
  };

  const gameOverState = () => gameOver;

  // Method to play a round
  const playRound = (row, col) => {
    if (gameOver) {
      return;
    }

    if (board.placeMark(row, col, currentPlayer.mark)) {
      board.printBoard();

      if (checkWin(row, col)) {
        console.log(`${currentPlayer.name} wins!`);
        gameOver = true;
        DisplayController.updateMessage(`${getCurrentPlayer().name} wins!`);
      } else if (checkTie()) {
        console.log("It's a tie!");
        gameOver = true;
        DisplayController.updateMessage(`It's a tie!`);
      } else {
        switchPlayer();
        console.log(`${getCurrentPlayer().name}'s turn.`);
        DisplayController.updateMessage(`${getCurrentPlayer().name}'s turn.`);
      }

      DisplayController.updateDisplay();
    }
  };

  return {
    playRound,
    getCurrentPlayer,
    switchPlayer,
    getBoard,
    resetGame,
    gameOverState,
    checkTiePass,
  };
})();

// DisplayController Module
const DisplayController = (function () {
  const updateDisplay = () => {
    const boardState = GameController.getBoard();
    console.log("Board State:", boardState);
    console.log("Game over state:", GameController.gameOverState());

    const buttons = document.querySelectorAll(".board button");
    buttons.forEach((button, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const mark = boardState[row][col];

      if (mark === null) {
        button.textContent = "";
        button.disabled = false;
      } else {
        button.textContent = mark;
        button.disabled = true;
      }
    });
  };

  const updateMessage = (text) => {
    const announcementText = document.getElementById("announcement-text");
    announcementText.textContent = text;
  };

  const handleButtonClick = (event) => {
    if (GameController.gameOverState()) {
      return;
    }

    const buttonIndex = Array.from(event.target.parentNode.children).indexOf(
      event.target
    );
    const row = Math.floor(buttonIndex / 3);
    const col = buttonIndex % 3;

    console.log(`Button clicked!: row ${row}, col ${col}`);
    GameController.playRound(row, col);
  };

  const handleResetButtonClick = () => {
    GameController.resetGame();
    updateDisplay();
    console.log("Game has been reset.");
  };

  const attachEventListeners = () => {
    const buttons = document.querySelectorAll(".board button");
    buttons.forEach((button) =>
      button.addEventListener("click", handleButtonClick)
    );

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", handleResetButtonClick);
  };

  const initialize = () => {
    attachEventListeners();
    updateDisplay();
    console.log("DisplayController initialized");
  };

  return { initialize, updateDisplay, updateMessage };
})();

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  DisplayController.initialize();
});
