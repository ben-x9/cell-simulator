import { useState } from "react"
import "./App.css"
import { range } from "lodash"
import clsx from "clsx"

const boardSize = 32

type Board = boolean[][]
const initialBoard: Board = range(boardSize).map(() =>
  Array(boardSize).fill(false)
)

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
      board.map((row, i) => row.map((cell, j) => Math.random() > 0.5))
    )
  }

  return (
    <div className="App">
      <table>
        <tbody>
          {board.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <td
                  key={cIndex}
                  className={clsx("cell", { on: cell })}
                  onMouseDown={() => toggle(rIndex, cIndex)}
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
