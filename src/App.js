import { useState } from 'react';

function Cell({ value, onCellClick }) {
  return (
    <button
      className="p-4 border
      border-gray-300
      rounded-md
      bg-primary
      hover:hoverBg
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      text-lg
      font-bold
      w-20
      h-20 
      flex 
      items-center
      justify-center"
      onClick={onCellClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    onPlay(nextSquares);

    setTimeout(() => {
      makeAIMove(nextSquares);
    }, 500);
  }

  function makeAIMove(currentSquares) {
    if (calculateWinner(currentSquares)) {
      return;
    }

    const bestMove = findBestMove(currentSquares);
    if (bestMove !== null) {
      const nextSquares = currentSquares.slice();
      nextSquares[bestMove] = 'O';
      onPlay(nextSquares);
    }
  }

  function findBestMove(squares) {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(squares, isMaximizing) {
    const winner = calculateWinner(squares);
    if (winner === 'O') return 10;
    if (winner === 'X') return -10;
    if (!squares.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
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
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const renderBoard = () => {
    const boardRows = [];
    for (let row = 0; row < 3; row++) {
      const cells = [];
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        cells.push(
          <Cell
            key={index}
            value={squares[index]}
            onCellClick={() => handleClick(index)}
          />
        );
      }
      boardRows.push(
        <div key={row} className="flex space-x-2">
          {cells}
        </div>
      );
    }
    return boardRows;
  };

  return (
    <>
      <div className="text-xl font-bold text-primary mb-4">{status}</div>
      <div className="flex flex-col space-y-2">{renderBoard()}</div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button
          className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
        <ol className="list-decimal pl-6 space-y-2">{moves}</ol>
      </div>
    </div>
  );
}
