/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import { boundingBox, Point2D } from '../utils/2D.js';

function initialElvesPositions(input: string[]) {
  const elves: Point2D[] = []
  input.forEach((row, rowIndex) => {
    Array.from(row).forEach((col, colIndex) => {
      if (col === '#') {
        elves.push(new Point2D([colIndex + 1, rowIndex + 1]))
      }
    })
  })
  return elves
}

const moves = [
  {
    direction: 'N',
    condition: ['N', 'NE', 'NW'],
  },
  {
    direction: 'S',
    condition: ['S', 'SE', 'SW'],
  },
  {
    direction: 'W',
    condition: ['W', 'NW', 'SW'],
  },
  {
    direction: 'E',
    condition: ['E', 'NE', 'SE'],
  },
]

function someElvesMove(elves:Point2D[]) {
  const allDirections = ['N', 'W', 'E', 'S', 'NW', 'NE', 'SW', 'SE']
  const elfPositions = new Set(elves.map(e => e.key))

  return elves.some(elf => !allDirections.every(d => !elfPositions.has(elf.moveTo(d).key)))
}

function firstHalf(elves:Point2D[], nthRound:number) {
  const allDirections = ['N', 'W', 'E', 'S', 'NW', 'NE', 'SW', 'SE']
  const elfPositions = new Set(elves.map(e => e.key))
  const startingMove = nthRound % moves.length

  const movesForThisRound = _.concat(moves.slice(startingMove), moves.slice(0, startingMove))

  return elves.map(elf => {
    // Elf is not moving because every direction is free around him
    if (allDirections.every(d => !elfPositions.has(elf.moveTo(d).key))) {
      return elf
    }

    // Go through each possible direction
    for (let i = 0; i < movesForThisRound.length; i += 1) {
      // If all conditions are filfulled, move into that direction
      if (movesForThisRound[i].condition.every(d => !elfPositions.has(elf.moveTo(d).key))) {
        return elf.moveTo(movesForThisRound[i].direction)
      }
    }

    return elf
  })
}

function secondHalf(proposals: Point2D[], original: Point2D[]) {
  const proposalKeys = proposals.map(e => e.key)
  return proposals.map((proposal, index) => (proposalKeys.filter(key => key === proposal.key).length > 1 ? original[index] : proposal))
}

function round(elves: Point2D[], nthRound: number) {
  const proposals = firstHalf(elves, nthRound)
  return secondHalf(proposals, elves)
}

function emptyTiles(elves: Point2D[]) {
  const bb = boundingBox(elves)
  return Math.abs(bb.x.max - bb.x.min + 1) * Math.abs(bb.y.max - bb.y.min + 1) - elves.length
}

export default function solve() {
  const input = aoc.input().split('\n').reverse();
  const elvesPositions = initialElvesPositions(input)
  let result = elvesPositions

  for (let i = 0; i < 10; i += 1) {
    result = round(result, i)
  }
  console.log('Part I', emptyTiles(result))
}
