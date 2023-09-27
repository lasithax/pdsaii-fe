import React from 'react';
import { Link } from 'react-router-dom';
import './gameMenu.css';

function GameMenu() {
  return (
    <div className="menu-container">
      <h1>Game Menu</h1>
      <ul>
        <li><Link to="/knights-tour">Knight's Tour Problem</Link></li>
        <li><Link to="/longest-common-sequence">Identify Longest Common Sequence</Link></li>
        <li><Link to="/eight-queens-puzzle">Eight Queens Puzzle</Link></li>
        <li><Link to="/tic-tac-toe">Tic-Tac-Toe</Link></li>
        <li><Link to="/shortest-path">Identify Shortest Path</Link></li>
      </ul>
    </div>
  );
}

export default GameMenu;