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
    if (board[index] || winner) {
      return;
    }

    const row = Math.floor(index / 3);
    const col = index % 3;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    axios
      .post(`http://localhost:8081/tictactoe/play?coordinate=${row},${col}`)
      .then((response) => {
        const computerMove = response.data.computerMove;
        const computerRow = computerMove[0];
        const computerCol = computerMove[1];

        const computerIndex = computerRow * 3 + computerCol;

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

          setIsGameStarted(false)
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
      className={`square-tic ${
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

        {board && (
            <>
            <div className="status">{!isGameConcluded && `Next player: ${isXNext ? "X" : "O"}`}</div>
            <div className="winner">Winner: {winner}</div>
            <div className="board-tic-tac">
                <div className="board-row-tic">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                </div>
                <div className="board-row-tic">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                </div>
                <div className="board-row-tic">
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
