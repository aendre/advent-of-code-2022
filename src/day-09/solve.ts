/* eslint-disable no-param-reassign */
import _ from 'lodash';
import math from '../utils/mathUtils.js'
import { patternMatch } from '../utils/stringutils.js';
import drawRopeSimulation from './bonus/drawRope.js'
import { readInput } from '../utils/aoc.js';

export type Position = {
  x: number
  y: number
}

export type Knot = {
  pos : Position
  history: Position[]
}

function moveHead(H: Knot, direction: string) {
  switch (direction) {
    case 'R': H.pos.x += 1; break;
    case 'U': H.pos.y += 1; break;
    case 'L': H.pos.x -= 1; break;
    case 'D': H.pos.y -= 1; break;
  }
  H.history.push({ ...H.pos })
}

function moveTail(T: Knot, H: Knot) {
  const xDiff = H.pos.x - T.pos.x;
  const yDiff = H.pos.y - T.pos.y;

  // They are in the same row and they are too far away from each other
  if (T.pos.y === H.pos.y && (xDiff > 1 || xDiff < -1)) {
    T.pos.x += 1 * Math.sign(xDiff)
    // Same column
  } else if (T.pos.x === H.pos.x && (yDiff > 1 || yDiff < -1)) {
    T.pos.y += 1 * Math.sign(yDiff)
    // Diagonal
  } else if (xDiff > 1 || xDiff < -1 || yDiff > 1 || yDiff < -1) {
    T.pos.x += 1 * Math.sign(xDiff)
    T.pos.y += 1 * Math.sign(yDiff)
  }
  T.history.push({ ...T.pos })
}

function uniquePositions(ropeEnd:Knot) {
  const uniqPos = _.uniq(ropeEnd.history.map(c => `${c.x}-${c.y}`))
  return uniqPos.length
}

export default function solve() {
  const content = readInput('input.txt')

  const moves = content.split('\n').map(c => patternMatch(c, '$str $int'))

  // Initialize
  const ropeLength = 10;
  const rope:Knot[] = Array(ropeLength).fill('')
    .map(() => ({ pos: { x: 0, y: 0 }, history: [{ x: 0, y: 0 }] }))

  moves.forEach(move => {
    const [direction, times] = move
    for (let i = 0; i < times; i += 1) {
      moveHead(rope[0], direction)
      for (let j = 1; j < rope.length; j += 1) {
        moveTail(rope[j], rope[j - 1])
      }
    }
  });
  console.log('RESULT', uniquePositions(rope[ropeLength - 1]))

  drawRopeSimulation(rope, 10)
}
