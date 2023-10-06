import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/shortestPath.css";

function ShortestPathGame() {
  const [gameData, setGameData] = useState(null);
  const [selectedPaths, setSelectedPaths] = useState(Array(9).fill(""));
  const [selectedDistances, setSelectedDistances] = useState(Array(9).fill(""));
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/shortestpath/start")
      .then((response) => {
        setGameData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
      });
  }, []);

  const handlePathChange = (index, event) => {
    const newPaths = [...selectedPaths];
    newPaths[index] = event.target.value;
    setSelectedPaths(newPaths);
  };

  const handleDistanceChange = (index, event) => {
    const newPaths = [...selectedDistances];
    newPaths[index] = event.target.value;
    setSelectedDistances(newPaths);
  };

  const handleSubmit = () => {
    const requestData = {
      paths: selectedPaths,
      distances: selectedDistances,
    };

    axios
      .post("http://localhost:8081/shortestpath/submit", requestData)
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shortest-path-container">
      <h1>Identify Shortest Path Game</h1>
      <p>Starting City: {gameData.startingCity}</p>
      <div className="graph">
        <table>
          <thead>
            <tr>
              <th></th>
              {gameData.distances.map((row, rowIndex) => (
                <th key={rowIndex}>{String.fromCharCode(65 + rowIndex)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameData.distances.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{String.fromCharCode(65 + rowIndex)}</td>
                {row.map((distance, colIndex) => (
                  <td key={colIndex}>{distance}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="input-container">
        <div className="distances">
          <h2>Enter total distances:</h2>
          <div>
            {gameData.distances.map((row, rowIndex) => (
              <div key={rowIndex}>
                <label>
                  Path from {gameData.startingCity} to{" "}
                  {String.fromCharCode(65 + rowIndex)}:
                  <input
                    type="text"
                    value={selectedDistances[rowIndex]}
                    onChange={(event) => handleDistanceChange(rowIndex, event)}
                    className="distances-input"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="paths">
          <h2>Select Shortest Paths:</h2>
          <div>
            {gameData.distances.map((row, rowIndex) => (
              <div key={rowIndex}>
                <label>
                  Path from {gameData.startingCity} to{" "}
                  {String.fromCharCode(65 + rowIndex)}:
                  <input
                    type="text"
                    value={selectedPaths[rowIndex]}
                    onChange={(event) => handlePathChange(rowIndex, event)}
                    className="paths-input"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {result && (
        <div>
          <p>Result: {result.result}</p>
          <p>Message: {result.message}</p>
          <p>Info: {result.info}</p>
        </div>
      )}
    </div>
  );
}

export default ShortestPathGame;
