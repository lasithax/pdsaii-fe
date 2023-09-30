import React, { useState } from "react";
import axios from "axios";
import queenIcon from "../chess-queen-icon.jpg";

import "../styles/eightQueensPuzzle.css";

function EightQueensPuzzle() {
  const [username, setUsername] = useState("");
  const [queenPositions, setQueenPositions] = useState(Array(64).fill(null));
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [message, setGameResultMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const startGame = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/eightqueens/start")
      .then((response) => {
        setGameStarted(true);
        setGameResult(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error starting the game:", error);
        setLoading(false);
      });
  };

  const submitResponse = () => {
    axios
      .post("http://localhost:8081/eightqueens/submit", {
        name: username,
        response: queenPositions.filter((position) => position !== null),
      })
      .then((response) => {
        const { count, message, info, result } = response.data;
        setGameResult(result);
        setGameResultMessage(message)
      })
      .catch((error) => {
        console.error("Error submitting the response:", error);
      });
  };

  const handleBoardClick = (index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
  
    // Check if there's already a queen in the same column
    const isQueenInSameColumn = queenPositions.some(
      (position, i) => position !== null && i % 8 === col
    );
  
    if (!isQueenInSameColumn) {
      const newQueenPositions = [...queenPositions];
      newQueenPositions[index] = index; // Set queen position to the clicked index
      setQueenPositions(newQueenPositions);
    }
  };

  const renderChessboard = () => {
    const rows = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const index = row * 8 + col;
        const isBlackSquare = (row + col) % 2 === 1;

        rows.push(
          <div
            key={index}
            className={`eight-square ${isBlackSquare ? "black" : "white"}`}
            onClick={() => handleBoardClick(index)}
          >
            {queenPositions[index] !== null && (
              <img src={queenIcon} alt="Queen" className="queen-icon" />
            )}
          </div>
        );
      }
    }
    return rows;
  };

  const restartGame = () => {
    window.location.reload()
  }

  return (
    <div>
      <h1>Eight Queens' Puzzle</h1>
      <div className="username-input">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={startGame} disabled={loading}>
          {loading ? "Loading..." : "Start Game"} {/* Show loading text when loading */}
        </button>
      </div>

      {gameStarted && (
        <>
          <h2>Queen Placements</h2>
          <div className="chessboard">{renderChessboard()}</div>

          <button onClick={submitResponse}>Submit Response</button>
          {gameResult == "LOST" ? (
            <div className="game-result-lost">{message}: {gameResult}</div>
          ) : (
            <div className="game-result-won">{gameResult}</div>
          )}
        </>
      )}
      <button onClick={restartGame}>Reload Game</button>
    </div>
  );
}

export default EightQueensPuzzle;
