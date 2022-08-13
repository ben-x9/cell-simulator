import {
  absModulo,
  Board,
  generateBoard,
  generateCell,
  getCell,
  numNeighbors,
  toggleCell,
  wrappedCoords,
} from "./App"

describe("absModulo", () => {
  test("wraps negative numbers", () => {
    expect(absModulo(-1, 32)).toBe(32 - 1)
    expect(absModulo(-7, 32)).toBe(32 - 7)
  })
  test("wraps positive numbers", () => {
    expect(absModulo(35, 32)).toBe(35 - 32)
    expect(absModulo(41, 32)).toBe(41 - 32)
  })
  test("0 <= result < m", () => {
    expect(absModulo(-1, 6)).toBe(5)
    expect(absModulo(0, 6)).toBe(0)
    expect(absModulo(1, 6)).toBe(1)
    expect(absModulo(3, 6)).toBe(3)
    expect(absModulo(5, 6)).toBe(5)
    expect(absModulo(6, 6)).toBe(0)
    expect(absModulo(7, 6)).toBe(1)
  })
})

const _ = false
const O = true

const toggleBoard: Board = [
  [_, _, _, _, _, _],
  [_, O, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, O],
]

describe("wrappedCoords", () => {
  test("positions outside the board will wrap to the other side", () => {
    expect(wrappedCoords(toggleBoard, 1, 1)).toEqual([1, 1])
    expect(wrappedCoords(toggleBoard, 0, -2)).toEqual([0, 4])
    expect(wrappedCoords(toggleBoard, -2, 0)).toEqual([4, 0])
    expect(wrappedCoords(toggleBoard, -1, -1)).toEqual([5, 5])
  })
})

describe("toggleCell", () => {
  test("toggles any given cell on the board", () => {
    expect(toggleCell(toggleBoard, 0, 0)).toEqual([
      [O, _, _, _, _, _],
      [_, O, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, O],
    ])
    expect(toggleCell(toggleBoard, 1, 1)).toEqual([
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, O],
    ])
    expect(toggleCell(toggleBoard, -1, -1)).toEqual([
      [_, _, _, _, _, _],
      [_, O, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
    ])
  })
})

const gliderBoard: Board = [
  [_, O, _, _, _, _],
  [_, _, O, _, _, _],
  [O, O, O, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]

describe("getCell", () => {
  test("returns the value of the cell at specified position", () => {
    const cell = getCell(gliderBoard)
    // Row 0
    expect(cell(0, 0)).toBe(false)
    expect(cell(0, 1)).toBe(true)
    expect(cell(0, 2)).toBe(false)
    // Row 1
    expect(cell(1, 0)).toBe(false)
    expect(cell(1, 1)).toBe(false)
    expect(cell(1, 2)).toBe(true)
    // Row 2
    expect(cell(2, 0)).toBe(true)
    expect(cell(2, 1)).toBe(true)
    expect(cell(2, 2)).toBe(true)
  })

  test("positions outside the board will wrap to the other side", () => {
    const cell = getCell(gliderBoard)
    // Row 6 = Row 0
    expect(cell(6, 0)).toBe(false)
    expect(cell(6, 1)).toBe(true)
    expect(cell(6, 2)).toBe(false)
    // Col 6 = Col 0
    expect(cell(0, 6)).toBe(false)
    expect(cell(1, 6)).toBe(false)
    expect(cell(2, 6)).toBe(true)
    // Col -4 = Col 3
    expect(cell(0, -4)).toBe(false)
    expect(cell(1, -4)).toBe(true)
    expect(cell(2, -4)).toBe(true)
  })
})

const neighborBoard: Board = [
  [O, _, _, O, _, _],
  [_, _, _, O, O, _],
  [O, O, _, _, _, _],
  [_, _, _, O, O, _],
  [O, _, _, O, O, O],
  [_, _, _, _, O, _],
]

describe("numNeighbors", () => {
  test("returns the number of neighbors for any given cell", () => {
    expect(numNeighbors(neighborBoard, 0, 0)).toBe(0)
    expect(numNeighbors(neighborBoard, 2, 0)).toBe(1)
    expect(numNeighbors(neighborBoard, 1, 4)).toBe(2)
    expect(numNeighbors(neighborBoard, 1, 1)).toBe(3)
    expect(numNeighbors(neighborBoard, 3, 3)).toBe(3)
    expect(numNeighbors(neighborBoard, 4, 5)).toBe(4)
    expect(numNeighbors(neighborBoard, 4, 4)).toBe(5)
  })
})

describe("generateCell", () => {
  describe("generates the next state of a cell based on the current state of its neighbors", () => {
    test("deactivates a cell when there are less than two neighbors", () => {
      expect(generateCell(neighborBoard, 0, 0)).toEqual(false)
      expect(generateCell(neighborBoard, 2, 0)).toEqual(false)
      expect(generateCell(neighborBoard, -2, 1)).toEqual(false)
    })
    test("activates a cell when there are exactly three neigbors", () => {
      expect(generateCell(neighborBoard, 2, 2)).toEqual(true)
      expect(generateCell(neighborBoard, 1, -1)).toEqual(true)
    })
    test("mantains an active cell that has two or three neigbors", () => {
      expect(generateCell(neighborBoard, 1, 4)).toEqual(true)
      expect(generateCell(neighborBoard, 3, 3)).toEqual(true)
    })
    test("deactivates a cell when there are more than three neighbors", () => {
      expect(generateCell(neighborBoard, 4, 5)).toEqual(false)
      expect(generateCell(neighborBoard, 4, 4)).toEqual(false)
    })
  })
})

const gliderBoardStage2: Board = [
  [_, _, _, _, _, _],
  [O, _, O, _, _, _],
  [_, O, O, _, _, _],
  [_, O, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]

const gliderBoardStage3: Board = [
  [_, _, _, _, _, _],
  [_, _, O, _, _, _],
  [O, _, O, _, _, _],
  [_, O, O, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]

const gliderBoardStage4: Board = [
  [_, _, _, _, _, _],
  [_, O, _, _, _, _],
  [_, _, O, O, _, _],
  [_, O, O, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]

const gliderBoardStage5: Board = [
  [_, _, _, _, _, _],
  [_, _, O, _, _, _],
  [_, _, _, O, _, _],
  [_, O, O, O, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
]

describe("generateBoard", () => {
  test("glider board stage 1 -> 2", () => {
    expect(generateBoard(gliderBoard)).toEqual(gliderBoardStage2)
  })
  test("glider board stage 2 -> 3", () => {
    expect(generateBoard(gliderBoardStage2)).toEqual(gliderBoardStage3)
  })
  test("glider board stage 3 -> 4", () => {
    expect(generateBoard(gliderBoardStage3)).toEqual(gliderBoardStage4)
  })
  test("glider board stage 4 -> 5", () => {
    expect(generateBoard(gliderBoardStage4)).toEqual(gliderBoardStage5)
  })
})
