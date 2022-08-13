import { range } from "lodash"

export type Board = boolean[][]

export const newBoard = (size: number): Board =>
  range(size).map(() => Array(size).fill(false))

export const absModulo = (n: number, m: number) => ((n % m) + m) % m

export const wrappedCoords = (board: Board, r: number, c: number) => {
  const numRows = board.length
  const numCols = board[0].length
  return [absModulo(r, numRows), absModulo(c, numCols)]
}

export const getCell = (board: Board) => (r: number, c: number) => {
  const [wrappedR, wrappedC] = wrappedCoords(board, r, c)
  return board[wrappedR][wrappedC]
}

export const numNeighbors = (board: Board, r: number, c: number) => {
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

export const toggleCell = (
  board: Board,
  targetRow: number,
  targetCell: number
) => {
  const [_targetRow, _targetCell] = wrappedCoords(board, targetRow, targetCell)
  return board.map((row, curRow) =>
    curRow === _targetRow
      ? row.map((cell, curCell) => (curCell === _targetCell ? !cell : cell))
      : row
  )
}

export const generateCell = (board: Board, r: number, c: number) => {
  const isCellActive = getCell(board)(r, c)
  const _numNeighbors = numNeighbors(board, r, c)
  if (isCellActive) {
    return _numNeighbors === 2 || _numNeighbors === 3
  } else {
    return _numNeighbors === 3
  }
}

export const generateBoard = (board: Board): Board =>
  board.map((row, r) => row.map((_, c) => generateCell(board, r, c)))
