import "./App.css"
import { useState, SetStateAction, Dispatch } from "react"
import { Board, generateBoard, newBoard, toggleCell } from "./models/board"
import clsx from "clsx"

const initialBoard = newBoard(32)

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
  setBoard: Dispatch<SetStateAction<Board>>
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
                className={clsx("cell", { on: cell })}
                onMouseDown={() => toggle(r, c)}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
