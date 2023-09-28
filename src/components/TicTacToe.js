import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/ticTacToe.css";

function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const [username, setUsername] = useState("");
  const [isGameStarted, setIsGameStarted] = useState();
  const [isGameConcluded, setIsGameConcluded] = useState();

  // Function to start the game with the user's name
  const startGame = () => {
    axios
      .get(`http://localhost:8081/tictactoe/start?username=${username}`)
      .then((response) => {
        setIsGameStarted(response.data == "Game started");
      })
      .catch((error) => {
        console.error("Error starting the game:", error);
      });
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const handleSquareClick = (index) => {
    // If the square is already filled or the game is over, do nothing
    if (board[index] || winner) {
      return;
    }

    // Calculate row and column coordinates from the index
    const row = Math.floor(index / 3);
    const col = index % 3;

    // Create a copy of the board
    const newBoard = [...board];
    // Update the board with X or O based on the current turn
    newBoard[index] = isXNext ? "X" : "O";
    // Update the state
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // Call the API to make the computer's move with the coordinates
    axios
      .post(`http://localhost:8081/tictactoe/play?coordinate=${row},${col}`)
      .then((response) => {
        // Extract the computer's move coordinates from the response
        const computerMove = response.data.computerMove;
        const computerRow = computerMove[0];
        const computerCol = computerMove[1];

        // Calculate the index on the board using the coordinates
        const computerIndex = computerRow * 3 + computerCol;

        // Update the board with the computer's move
        newBoard[computerIndex] = "O";
        setBoard(newBoard);
        
        if (
          response.data.gameState == "Lost" ||
          response.data.gameState == "Won" ||
          response.data.gameState == "Draw"
        ) {
          setIsGameConcluded(true);

          if (response.data.gameState == "Lost") {
            setWinner("Computer");
          } else if (response.data.gameState == "Won") {
            setWinner(username);
          } else if (response.data.gameState == "Draw") {
            setWinner("Draw");
          }
        } else {
          setIsXNext(true);
        }
      })
      .catch((error) => {
        console.error("Error making computer move:", error);
      });
  };

  const renderSquare = (index) => (
    <div
      className={`square ${
        board[index] ? (board[index] === "X" ? "x" : "o") : ""
      }`}
      onClick={() => handleSquareClick(index)}
    >
      {board[index]}
    </div>
  );

    return (
        <div>
        <h1>Tic-Tac-Toe Game</h1>
        {!isGameStarted && <div className="username-input">
            <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={startGame}>Start Game</button>
        </div>}

        {isGameStarted && board && (
            <>
            <div className="status">{!isGameConcluded && `Next player: ${isXNext ? "X" : "O"}`}</div>
            <div className="winner">Winner: {winner}</div>
            <div className="board">
                <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                </div>
                <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                </div>
                <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
                </div>
            </div>
            <button className="restart-button" onClick={initializeBoard}>
                Restart Game
            </button>
            </>
        )}
        </div>
    );
}

export default TicTacToeGame;
