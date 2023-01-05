/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import { Coordinate } from '../utils/2D.js';

const toKey = (c:Coordinate) => `${c[0]}-${c[1]}`

function convertToCordinates(anchorPoint:number[][]):Coordinate[] {
  const coords:Coordinate[] = []
  for (let i = 0; i < anchorPoint.length - 1; i += 1) {
    let [fromX, fromY] = anchorPoint[i]
    const [toX, toY] = anchorPoint[i + 1]
    coords.push([fromX, fromY])
    while (fromX !== toX || fromY !== toY) {
      fromX += fromX === toX ? 0 : 1 * Math.sign(toX - fromX)
      fromY += fromY === toY ? 0 : 1 * Math.sign(toY - fromY)
      coords.push([fromX, fromY])
    }
  }
  return coords
}

function fallSand(sand:Coordinate, solid:Set<string>, limit:number): Coordinate {
  let nextStep:Coordinate

  // Fallen down to eternity
  if (sand[1] >= limit) {
    return sand
  }

  // Falling down one step
  nextStep = [sand[0], sand[1] + 1]
  if (!solid.has(toKey(nextStep))) {
    return fallSand(nextStep, solid, limit)
  }
  // Diagonal left
  nextStep = [sand[0] - 1, sand[1] + 1]
  if (!solid.has(toKey(nextStep))) {
    return fallSand(nextStep, solid, limit)
  }

  // Diagonal right
  nextStep = [sand[0] + 1, sand[1] + 1]
  if (!solid.has(toKey(nextStep))) {
    return fallSand(nextStep, solid, limit)
  }

  return sand
}

function simulate(solid:Set<string>, limit:number) {
  let fallenTo
  let sandCount = 0

  do {
    fallenTo = fallSand([500, 0], solid, limit)
    if (fallenTo[1] !== limit) {
      solid.add(toKey(fallenTo))
      sandCount += 1
    }
  } while (fallenTo[1] !== limit)

  return sandCount
}

function simulateWithFloor(solid:Set<string>, limit:number) {
  let fallenTo
  let sandCount = 0
  const floorLimit = limit + 2

  do {
    fallenTo = fallSand([500, 0], solid, floorLimit - 1)
    if (fallenTo[0] !== 500 || fallenTo[1] !== 0) {
      solid.add(toKey(fallenTo))
      sandCount += 1
    }
  } while (fallenTo[0] !== 500 || fallenTo[1] !== 0)

  return sandCount
}

export default function solve() {
  const content = aoc.readInput('input.txt')
    .split('\n')
    .map(c => c.split(' -> ')
      .map(cord => cord.split(',')
        .map(Number)))

  const solid = new Set<string>()
  const coords = content.map(convertToCordinates).flat()
  const lowestPoint = Math.max(...coords.map(c => c[1]))
  coords.map(toKey).forEach(c => solid.add(c))

  const part1 = simulate(new Set(solid), lowestPoint)
  console.log('PART I', part1)

  const part2 = simulateWithFloor(new Set(solid), lowestPoint)
  console.log('PART I', part2 + 1)
}
