// GameBoard Module
const gameBoard = (function () {
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
const gameController = (function () {
  const player1 = Player("Faizan", "X");
  const player2 = Player("Muaz", "O");
  let currentPlayer = player1;
  const board = gameBoard;

  // Method to switch Player after a turn
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Method to get the board state
  const getBoard = () => board.getBoard(); // Delegate to gameBoard.getBoard()

  // Method to get the current Player
  const getCurrentPlayer = () => currentPlayer;

  // Method to check for a win
  const checkWin = (row, col) => {
    const boardState = board.getBoard(); // Use getBoard() to get the actual state
    const mark = currentPlayer.mark;

    // Check row
    if (boardState[row].every((cell) => cell === mark)) return true;

    // Check column
    if (boardState.every((row) => row[col] === mark)) return true;

    // Check diagonals
    if (row === col && boardState.every((row, idx) => row[idx] === mark))
      return true;
    if (
      row + col === 2 &&
      boardState.every((row, idx) => row[2 - idx] === mark)
    )
      return true;

    return false;
  };

  // Method to check for a tie
  const checkTie = () => {
    const allCellsFilled = board
      .getBoard()
      .every((row) => row.every((cell) => cell !== null));
    return allCellsFilled && !checkWin();
  };

   // Method to reset the game
   const resetGame = () => {
    board.resetBoard(); // Reset the board state
    currentPlayer = player1; // Set the starting player to player1
    console.log(`${currentPlayer.name}'s turn.`);
  };

  // Method to play a round
  const playRound = (row, col) => {
    if (board.placeMark(row, col, currentPlayer.mark)) {
      board.printBoard(); // Print the board after each move
      if (checkWin(row, col)) {
        console.log(`${currentPlayer.name} wins!`);
        board.resetBoard();
      } else if (checkTie()) {
        console.log("It's a tie!");
        board.resetBoard(); // *** This should be a button
      } else {
        switchPlayer();
        console.log(`${getCurrentPlayer().name}'s turn.`);
      }
    }
  };

  // Initial play game message
  console.log(`${currentPlayer.name}'s turn.`);
  board.printBoard();

  return { playRound, getCurrentPlayer, switchPlayer, getBoard, resetGame };
})();

// DisplayController Module
const DisplayController = (function () {
  const updateDisplay = () => {
    // Get the current state of the board from the gameController
    const boardState = gameController.getBoard();
    console.log("Board State:", boardState); // Log the entire board state

    // Get all the buttons in the board
    const buttons = document.querySelectorAll(".board button");

    // Iterate over each button and update its textContent based on the board state
    buttons.forEach((button, index) => {
      const row = Math.floor(index / 3); // Calculate the row index
      const col = index % 3; // Calculate the column index
      const mark = boardState[row][col]; // Get the mark ('X' or 'O') or null

      // Update the button text based on the mark
      if (mark === null) {
        button.textContent = ""; // Clear the button if there's no mark
      } else {
        button.textContent = mark; // Set the button text to 'X' or 'O'
      }
    });
  };

  const handleButtonClick = (event) => {
    const buttonIndex = Array.from(event.target.parentNode.children).indexOf(
      event.target
    );
    const row = Math.floor(buttonIndex / 3);
    const col = buttonIndex % 3;

    console.log(`Button clicked: row ${row}, col ${col}`); // Add this to verify click position

    gameController.playRound(row, col);
    updateDisplay();
  };

  const handleResetButtonClick = () => {
    gameController.resetGame();
    updateDisplay(); // Update display to reflect reset
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
    console.log("DisplayController initialized"); // Verify initialization
  };
  return { initialize };
})();

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  DisplayController.initialize();
});
