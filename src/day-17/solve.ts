import _ from 'lodash';
import graphlib, { Graph } from '@dagrejs/graphlib'
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import * as shapes from './shapes.js'
import { Coordinate } from '../day-14/solve.js';

enum Move {
  Left = '<',
  Right = '>',
  Down = 'DOWN',
}

const moveMap: { [key:string]: Coordinate } = {
  [Move.Left]: [-1, 0],
  [Move.Right]: [1, 0],
  [Move.Down]: [0, -1],
}

function* cyclicIterator<T>(array: T[]): Generator<T, T, boolean> {
  const { length } = array
  let iteration = 0;
  while (true) {
    yield array[iteration % length]
    iteration += 1
  }
}

function moveShape(shape:Coordinate[], moveBy: Coordinate) {
  return shape.map(c => math.add(c, moveBy))
}

function initializeShape(shape: Coordinate[], top:number) {
  return moveShape(shape, [2, top + 3])
}

function getHighestPoint(arr: Coordinate[]) {
  return Math.max(...arr.map(c => c[1]))
}

function withinChamberLimits(shape: Coordinate[]) {
  return shape.map(s => s[0]).every(c => c > 0 && c < 8)
}

function notCrushinhWithOthers(shape: Coordinate[], chamber:Coordinate[]) {
  const chamberSet = new Set(chamber.map(c => c.join('-')))

  return shape.every(s => !chamberSet.has(s.join('-')))
}

function print(chamber: Coordinate[], maxHeight:number) {
  for (let y = maxHeight; y > 0; y -= 1) {
    let row = ''
    for (let x = 1; x < 8; x += 1) {
      row += typeof chamber.find(c => c[0] === x && c[1] === y) === 'undefined' ? '.' : '#'
    }
    console.log(row)
  }
  console.log('\n\n')
}

export default function solve() {
  const input = aoc.inputE()
  const moves = [...input] as Move[]
  const chamber: Coordinate[] = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], // Initialize the chamber with a floor
  ]

  const jetIterator = cyclicIterator(moves)
  const shapeIterator = cyclicIterator([shapes.shapeDash, shapes.shapePlus, shapes.shapeL, shapes.shapeI, shapes.shapeSquare])

  Array(2).fill('').forEach(() => {
    let shape = [...initializeShape(shapeIterator.next().value, getHighestPoint(chamber))]
    let moving = true
    while (moving) {
      // Move to left/right
      const shiftedShape = moveShape(shape, moveMap[jetIterator.next().value])
      shape = withinChamberLimits(shiftedShape) && notCrushinhWithOthers(shiftedShape, chamber) ? shiftedShape : shape
      // Move one position down
      const movedDownShape = moveShape(shape, moveMap[Move.Down])

      // If settled add it the the chamber
      if (notCrushinhWithOthers(movedDownShape, chamber)) {
        shape = movedDownShape
      } else {
        moving = false
        chamber.push(...shape)
      }
    }
  })

  // print(chamber, getHighestPoint(chamber))
  console.log('Part I', getHighestPoint(chamber))
}
