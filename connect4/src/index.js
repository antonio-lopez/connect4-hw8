import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
function Square(props) {
    return (
      <button className={cName(props.value, props.highlight)} onClick={props.onClick}>
        
      </button>
    );
  }
 
class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }

  render() {
    const horSize = 7;
    const verSize = 6;
    let squares = [];
    let row = [];

    for (let i = 0; i < verSize; i++)
    {
      squares = [];
      for (let j = 0; j < horSize; j++) {
        let size = i * horSize + j;
        squares.push(this.renderSquare(size))
      }
      row.push(<div key={i} className="board-row">{squares}</div>)
    }
    return (<div> {row} </div> );
  }
}

function cName(val1, val2) {
  if (val2) {
    return 'square highlight'
  } else if (val1 === 'Red') {
    return 'square red';
  } else if (val1 === 'Yellow') {
    return 'square yellow';
  } else {
    return 'square';
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(42).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
      x: 0,
      y: 0
    };
  }

  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      let squares = current.squares.slice();
      squares[i] = this.state.xIsNext ? 'Red' : 'Yellow';
      this.setState({
        history: history.concat([{
          squares: squares,
          squareX: 1 + i % 7,
          squareY: 1 + Math.floor(i / 6)
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
      if (calculateWinner(squares).winner) {
        return;
      }
    }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortSwitch() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winObj = calculateWinner(current.squares);
    const winner = winObj.winner;
    
    const moves = history.map((step, move) => {
      const desc = move ?
        ('Go to move #' + move + ' (' + step.squareX + ', ' + step.squareY + ')') :
        'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'last-move' : ''}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!current.squares.includes(null)) {
      status = 'DRAW';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'Red' : 'Yellow');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winObj.winningline}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortSwitch()}>
            Sort: {this.state.isAscending ? 'ascending' : 'descending'}
          </button>
          <ol>{+ this.state.isAscending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
ReactDOM.render( <Game />, document.getElementById('root'));

function checkHorizontal(squares) {
  let a = 0, b = 1, c = 2, d = 3;
  let arr = [a, b, c, d];
  for (let j = 0; j < 6; j++)
  {
    for (let i = 0; i < 4; i++){
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]){
        arr = [a, b, c, d];
        return {
          winning: true,
          winner: squares[a],
          winningline: arr,
      }
    }
    a++; b++; c++; d++;
  }
  a+=3; b+=3; c+=3; d+=3;
  }
  return {
    winning: false,
    winner: null,
    winningline: null,
  }
}

function checkVertical(squares) {
  for(let j = 0; j < 7; j++)
  {
    let a = 0, b = 7, c = 14, d = 21;
    let arr = [a, b, c, d];
    a+=j; b+=j; c+=j; d+=j
    for(let i = 0; i < 3; i++)
    {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]){
        arr = [a, b, c, d];
      return {
        winning: true,
        winner: squares[a],
        winningline: arr,
      }
    }
    a+=7; b+=7; c+=7; d+=7;
  }
}
return {
  winning: false,
  winner: null,
  winningline: null,
}
}

function checkDiagR(squares) {    
  let a = 0, b = 8, c = 16, d = 24;
  let arr = [a, b, c, d];
  for(let j = 0; j < 4; j++)
  {
    for(let i = 0; i < 4; i++)
    {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]){
        arr = [a, b, c, d];
      return {
        winning: true,
        winner: squares[a],
        winningline: arr,
      }
    }
    a++; b++; c++; d++;
  }
  a+=3; b+=3; c+=3; d+=3;
}
return {
  winning: false,
  winner: null,
  winningline: null,
}
}

function checkDiagL(squares) {
  let a = 3, b = 9, c = 15, d = 21;
  let arr = [a, b, c, d];
  for(let j = 0; j < 4; j++) {
    for(let i = 0; i < 4; i++) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
        arr = [a, b, c, d];
      return {
        winning: true,
        winner: squares[a],
        winningline: arr,
      }
    }
    a++; b++; c++; d++;
  }
  a+=3; b+=3; c+=3; d+=3;
}
return {
  winning: false,
  winner: null,
  winningline: null,
} 
}

function calculateWinner(squares) {
  let horizontal = checkHorizontal(squares);
  let vertical = checkVertical(squares);
  let diagR = checkDiagR(squares);
  let diagL = checkDiagL(squares);
  
  if (horizontal.winning === true) {
    return {
      winner: horizontal.winner,
      winningline: horizontal.winningline,
    }
  }
  else if (vertical.winning === true) {
    return {
      winner: vertical.winner,
      winningline: vertical.winningline,
    }
  }
  else if (diagR.winning === true) {
    return {
      winner: diagR.winner,
      winningline: diagR.winningline,
    }
  }
  else if (diagL.winning === true) {
    return {
      winner: diagL.winner,
      winningline: diagL.winningline,
    }
  }
  return {
    winner: null,
  }
}