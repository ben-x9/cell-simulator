import { render as _render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React, { Dispatch, SetStateAction } from "react"
import App, { boardSize, BoardView, initialBoard } from "./App"
import { Board } from "./models/board"

function render(tsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ..._render(tsx),
  }
}

const _ = false
const O = true

describe("App", () => {
  test("Renders correctly", async () => {
    render(<App />)

    // Has a table
    const table = await screen.findByRole("table")
    expect(table).toBeDefined()

    // Has buttons
    const buttons = await screen.findAllByRole("button")
    expect(buttons[0].innerHTML).toBe("Reset")
    expect(buttons[1].innerHTML).toBe("Next Generation")
  })

  test("Resets board", async () => {
    const { user, rerender } = render(<App />)

    // Click some cells
    const cells = await screen.findAllByRole("cell")
    await user.click(cells[1])
    await user.click(cells[2])
    await user.click(cells[3])
    rerender(<App />)

    // Check the cells are now alive
    const cellsAfterClick = await screen.findAllByRole("cell")
    expect(cellsAfterClick[1]).toHaveClass("alive")
    expect(cellsAfterClick[2]).toHaveClass("alive")
    expect(cellsAfterClick[3]).toHaveClass("alive")

    // Click Reset button
    const button = await screen.findByRole("button", { name: "Reset" })
    await user.click(button)
    rerender(<App />)

    // Check the cells are now off
    const cellsAfterReset = await screen.findAllByRole("cell")
    expect(cellsAfterReset[1]).not.toHaveClass("alive")
    expect(cellsAfterReset[2]).not.toHaveClass("alive")
    expect(cellsAfterReset[3]).not.toHaveClass("alive")
  })

  const getCellAt = (cells: HTMLElement[]) => (r: number, c: number) => {
    return cells[r * boardSize + c]
  }

  test("Next Generation", async () => {
    const { user, rerender } = render(<App />)

    // Click some cells to create a glider:
    //   [_, O, _, _, _, _],
    //   [_, _, O, _, _, _],
    //   [O, O, O, _, _, _],
    //   [_, _, _, _, _, _],
    //   [_, _, _, _, _, _],
    //   [_, _, _, _, _, _],
    let cellAt = getCellAt(await screen.findAllByRole("cell"))
    await user.click(cellAt(0, 1))
    await user.click(cellAt(1, 2))
    await user.click(cellAt(2, 0))
    await user.click(cellAt(2, 1))
    await user.click(cellAt(2, 2))
    rerender(<App />)

    // Check the clicked cells are alive
    cellAt = getCellAt(await screen.findAllByRole("cell"))
    expect(cellAt(0, 1)).toHaveClass("alive")
    expect(cellAt(1, 2)).toHaveClass("alive")
    expect(cellAt(2, 0)).toHaveClass("alive")
    expect(cellAt(2, 1)).toHaveClass("alive")
    expect(cellAt(2, 2)).toHaveClass("alive")

    // Click Next Generation button
    const button = await screen.findByRole("button", {
      name: "Next Generation",
    })
    await user.click(button)
    rerender(<App />)

    // Check that the glider has moved to the next stage
    //   [_, _, _, _, _, _],
    //   [O, _, O, _, _, _],
    //   [_, O, O, _, _, _],
    //   [_, O, _, _, _, _],
    //   [_, _, _, _, _, _],
    //   [_, _, _, _, _, _],
    cellAt = getCellAt(await screen.findAllByRole("cell"))
    expect(cellAt(0, 1)).not.toHaveClass("alive")
    expect(cellAt(1, 0)).toHaveClass("alive")
    expect(cellAt(1, 2)).toHaveClass("alive")
    expect(cellAt(2, 0)).not.toHaveClass("alive")
    expect(cellAt(2, 1)).toHaveClass("alive")
    expect(cellAt(2, 2)).toHaveClass("alive")
    expect(cellAt(3, 1)).toHaveClass("alive")
  })
})

describe("BoardView", () => {
  test("Renders initial board", async () => {
    const setBoard = jest.fn()
    render(<BoardView board={initialBoard} setBoard={setBoard} />)
    const cells = await screen.findAllByRole("cell")
    expect(cells).toHaveLength(boardSize * boardSize)
  })

  test("Renders active cells", async () => {
    const board = [
      [O, _, O, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
    ]
    const setBoard = jest.fn()
    render(<BoardView board={board} setBoard={setBoard} />)
    const cells = await screen.findAllByRole("cell")
    expect(cells[0]).toHaveClass("alive")
    expect(cells[2]).toHaveClass("alive")
  })

  test("Toggles empty cells on click", async () => {
    let board: Board = initialBoard
    const setBoard = jest.fn((newBoard: Board) => {
      board = newBoard
    })
    const { user, rerender } = render(
      <BoardView board={board} setBoard={setBoard} />
    )
    // Click a cell
    const cells = await screen.findAllByRole("cell")
    await user.click(cells[0])
    expect(setBoard).toHaveBeenCalledTimes(1)

    // Rerender the board
    rerender(<BoardView board={board} setBoard={setBoard} />)
    const cells2 = await screen.findAllByRole("cell")
    expect(cells2[0]).toHaveClass("alive")
  })

  test("Toggles active cells on click", async () => {
    let board = [
      [_, _, O, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
    ]

    const setBoard = jest.fn((newBoard: Board) => {
      board = newBoard
    })
    const { user, rerender } = render(
      <BoardView board={board} setBoard={setBoard} />
    )

    const cells = await screen.findAllByRole("cell")
    expect(cells[2]).toHaveClass("alive")

    // Click a cell
    await user.click(cells[2])
    expect(setBoard).toHaveBeenCalledTimes(1)

    // Rerender the board
    rerender(<BoardView board={board} setBoard={setBoard} />)
    const cells2 = await screen.findAllByRole("cell")
    expect(cells2[2]).not.toHaveClass("alive")
  })
})
