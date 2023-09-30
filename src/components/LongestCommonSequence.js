import React, { useState } from "react";
import axios from "axios";

import "../styles/lcs.css";

function LCSGame() {
  const [username, setUsername] = useState("");
  const [string1, setString1] = useState("");
  const [string2, setString2] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    axios
      .get(`http://localhost:8081/lcs/start?username=${username}`)
      .then((response) => {
        const data = response.data;
        setString1(data["string 1"]);
        setString2(data["string 2"]);
        setIsGameStarted(true);
        setResult("");
      })
      .catch((error) => {
        console.error("Error starting the game:", error);
      });
  };

  const submitAnswer = () => {
    axios
      .post(`http://localhost:8081/lcs/submit?answer=${answer}`)
      .then((response) => {
        setResult(response.data.result);
      })
      .catch((error) => {
        console.error("Error submitting the answer:", error);
      });
  };

  const restartGame = () => {
    window.location.reload()
  }

  return (
    <div>
      <h1>Longest Common Sequence Game</h1>
      <div className="username-input">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={startGame}>Start Game</button>
      </div>

      {isGameStarted && (
        <div>
          <div>
            <strong>String 1:</strong> {string1}
          </div>
          <div>
            <strong>String 2:</strong> {string2}
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={submitAnswer}>Submit Answer</button>
          </div>
          {result && (
            <div>
              <strong>Result:</strong> {result}
            </div>
          )}
        </div>
      )}
      <button onClick={restartGame}>Reload Game</button>
    </div>
  );
}

export default LCSGame;