import _ from 'lodash';
import Sugar from 'sugar';
import { readInput } from '../utils/aoc.js';

export type Range = {
  lower: number,
  upper:number
}

function isFullyContain(left:Range, right:Range) {
  if (left.lower >= right.lower && left.upper <= right.upper) {
    return true
  }
  if (right.lower >= left.lower && right.upper <= left.upper) {
    return true
  }
  return false
}

function isOverlapping(left:Range, right:Range) {
  if (left.lower <= right.lower && left.upper >= right.lower) {
    return true
  }
  if (right.lower <= left.lower && right.upper >= left.lower) {
    return true
  }
  return false
}

export default function solve() {
  const fileContent = readInput('input.txt')

  // Part I
  const result = Sugar.Array(fileContent.split('\n'))
    .map(pairs => pairs.split(',')
      .map(pair => pair.split('-'))
      .map(pair => ({ lower: parseInt(pair[0], 10), upper: parseInt(pair[1], 10) })))

  const part1 = result.map(pairs => isFullyContain(pairs[0], pairs[1]))
    .map(pair => (pair === true ? 1 : 0))
  console.log('RESULT PART I', part1.sum());

  const part2 = result.map(pairs => isOverlapping(pairs[0], pairs[1]))
    .map(pair => (pair === true ? 1 : 0))
  console.log('RESULT PART II', part2.sum());
}
