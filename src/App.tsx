import { useState } from "react"
import "./App.css"
import { range } from "lodash"
import clsx from "clsx"

const boardSize = 32

type Board = boolean[][]
const initialBoard: Board = range(boardSize).map(() =>
  Array(boardSize).fill(false)
)

const absModulo = (n: number, m: number) => ((n % m) + m) % m

const getCell = (board: Board) => (r: number, c: number) => {
  return board[absModulo(r, boardSize)][absModulo(c, boardSize)]
}

const numNeighbors = (board: Board, r: number, c: number) => {
  const cell = getCell(board)
  const left = cell(r, c - 1)
  const right = cell(r, c + 1)
  const top = cell(r - 1, c)
  const bottom = cell(r + 1, c)
  const topLeft = cell(r - 1, c - 1)
  const topRight = cell(r - 1, c + 1)
  const bottomLeft = cell(r + 1, c - 1)
  const bottomRight = cell(r + 1, c + 1)
  return (
    Number(left) +
    Number(right) +
    Number(top) +
    Number(bottom) +
    Number(topLeft) +
    Number(topRight) +
    Number(bottomLeft) +
    Number(bottomRight)
  )
}

const generateCell = (board: Board, r: number, c: number) => {
  const neighbors = numNeighbors(board, r, c)
  if (board[r][c]) {
    return neighbors === 2 || neighbors === 3
  } else {
    return neighbors === 3
  }
}

export default function App() {
  const [board, setBoard] = useState<Board>(initialBoard)

  const toggle = (rIndex: number, cIndex: number) => {
    setBoard(board =>
      board.map((row, r) =>
        rIndex === r ? row.map((cell, c) => (cIndex === c ? !cell : cell)) : row
      )
    )
  }

  const generate = () => {
    setBoard(board =>
      board.map((row, r) => row.map((_, c) => generateCell(board, r, c)))
    )
  }

  return (
    <div className="App">
      <table>
        <tbody>
          {board.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={clsx("cell", { on: cell })}
                  onMouseDown={() => toggle(r, c)}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="controls">
        <span className="button" onClick={() => setBoard(initialBoard)}>
          Reset
        </span>
        <button onClick={generate}>Next Generation</button>
      </div>
    </div>
  )
}
