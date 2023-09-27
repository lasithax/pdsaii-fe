import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Ensure you import 'Routes'

import GameMenu from './GameMenu';
import KnightsTour from './components/KnightsTour';
import LongestCommonSequence from './components/LongestCommonSequence';
import EightQueensPuzzle from './components/EightQueensPuzzle';
import TicTacToe from './components/TicTacToe';
import ShortestPath from './components/ShortestPath';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameMenu />} />
        <Route path="/knights-tour" element={<KnightsTour />} />
        <Route path="/longest-common-sequence" element={<LongestCommonSequence />} />
        <Route path="/eight-queens-puzzle" element={<EightQueensPuzzle />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/shortest-path" element={<ShortestPath />} />
      </Routes>
    </Router>
  );
}

export default App;