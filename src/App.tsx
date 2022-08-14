import "./App.css"
import { useState } from "react"
import { Board, generateBoard, newBoard, toggleCell } from "./models/board"
import clsx from "clsx"

export const boardSize = 30
export const initialBoard = newBoard(boardSize)

export default function App() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const generate = () => setBoard(generateBoard)

  return (
    <div className="App">
      <BoardView board={board} setBoard={setBoard} />
      <div className="controls">
        <button className="secondary" onClick={() => setBoard(initialBoard)}>
          Reset
        </button>
        <button onClick={generate}>Next Generation</button>
      </div>
    </div>
  )
}

export const BoardView = ({
  board,
  setBoard,
}: {
  board: Board
  setBoard: (board: Board) => void
}) => {
  const toggle = (r: number, c: number) => setBoard(toggleCell(board, r, c))
  return (
    <table>
      <tbody>
        {board.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td
                key={c}
                className={clsx("cell", { alive: cell })}
                onClick={() => toggle(r, c)}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
