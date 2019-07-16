import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square({ value, onClick, winSquares }) {
  return (
    <button className={`square ${winSquares ? 'win' : null}`} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick, winSquares }) {
  function renderSquare(i) {
    return (
      <Square
        key={`square${i}`}
        value={squares[i]}
        onClick={() => onClick(i)}
        winSquares={winSquares.includes(i)}
      />
    );
  }

  function renderSquares(i, size) {
    let squares = [];
    for (let j = i * size; j < i * size + size; j++) {
      squares.push(renderSquare(j));
    }
    return squares;
  }

  function renderBoard(size) {
    let board = [];
    for (let i = 0; i < size; i++) {
      board.push(
        <div key={i} className="board-row">
          {renderSquares(i, size)}
        </div>
      );
    }
    return board;
  }

  return <div>{renderBoard(3)}</div>;
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [XisNext, setNext] = useState(true);
  const [sortDesc, setSortDesc] = useState(true);
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const winSquares = winner ? winner.squares : [];

  const moves = history.map((step, move) => {
    const { location } = history[move];
    const desc = move
      ? `Go to move #${move} : Col ${location[0]} - Row ${location[1]}`
      : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {stepNumber === move ? <b>{desc}</b> : desc}
        </button>
      </li>
    );
  });

  const status = winner
    ? `Winner: ${winner.player}`
    : stepNumber === 9
    ? 'Draw'
    : 'Next player: ' + (XisNext ? 'X' : 'O');

  function handleClick(i) {
    const locationMap = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = XisNext ? 'X' : 'O';
    setHistory(newHistory.concat([{ squares, location: locationMap[i] }]));
    setStepNumber(newHistory.length);
    setNext(!XisNext);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setNext(step % 2 === 0);
  }

  function sortHistory() {
    setSortDesc(!sortDesc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winSquares={winSquares}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={sortHistory}>
          Order of moves: <b>{sortDesc ? 'Descending' : 'Ascending'}</b>
        </button>
        <ol>{sortDesc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { squares: [a, b, c], player: squares[a] };
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById('root'));
