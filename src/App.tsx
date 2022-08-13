import { useState } from "react"
import "./App.css"

import clsx from "clsx"
import { Board, generateBoard, newBoard, toggleCell } from "./models/board"

const initialBoard = newBoard(32)

export default function App() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const toggle = (r: number, c: number) => setBoard(toggleCell(board, r, c))
  const generate = () => setBoard(generateBoard)

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
