import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/knightsTour.css";

function KnightsTourGame() {
  const [chessPosition, setChessPosition] = useState("");
  const [userMoves, setUserMoves] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [currentMove, setCurrentMove] = useState("");

  useEffect(() => {
    // Fetch the initial game position
    axios
      .get("http://localhost:8081/knightstour/start")
      .then((response) => {
        const { chessPosition } = response.data;
        setChessPosition(chessPosition);
      })
      .catch((error) => {
        console.error("Error fetching initial position:", error);
      });
  }, []);

  const handleSquareClick = (position) => {
    setUserMoves([...userMoves, position]);
  };

  const handleAddMove = () => {
    // Handle adding the currentMove to userMoves
    setUserMoves([...userMoves, currentMove]);
    setCurrentMove(""); // Clear the input field
  };

  const verifyMoves = () => {
    // Send a POST request to verify user moves
    axios
      .post("http://localhost:8081/knightstour/verify", {
        name: "user3",
        response: userMoves,
      })
      .then((response) => {
        setGameResult(response.data);
      })
      .catch((error) => {
        console.error("Error verifying moves:", error);
      });
  };

  function isPositionInUserMoves(position) {
    return userMoves.includes(position);
  }

  return (
    <div>
      <h1>Knight's Tour Game</h1>
      <div className="game-container">
        <div className="chessboard">
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} className="chessboard-row">
              {Array.from({ length: 8 }).map((_, col) => {
                const position = `${String.fromCharCode(65 + col)}${8 - row}`;
                const isKnightHere = position === chessPosition;
                const isDarkSquare = (row + col) % 2 === 1; // Alternate square colors

                const isPositionSelected = isPositionInUserMoves(position);

                return (
                  <div
                    key={position}
                    className={`chessboard-square ${
                      isDarkSquare ? "dark-square" : "light-square"
                    } ${isKnightHere ? "knight" : ""} ${
                      isPositionSelected ? "selected-position" : ""
                    }`}
                    onClick={() => handleSquareClick(position)}
                  >
                    {position}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="user-input">
          <h2>Enter Your Moves</h2>
          <input
            type="text"
            placeholder="Enter a move (e.g., A1)"
            value={currentMove}
            onChange={(e) => setCurrentMove(e.target.value)}
          />
          <button onClick={handleAddMove}>Add Move</button>
          <button onClick={verifyMoves}>Verify Moves</button>
          {gameResult && (
            <div className="result">
              <p>Result: {gameResult.result}</p>
              <p>Comment: {gameResult.comment}</p>
            </div>
          )}
          <h3>Current Selected Moves:</h3>
          <ul className="user-moves">
            {userMoves.map((move, index) => (
              <li key={index} className="user-move">
                {move}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default KnightsTourGame;
