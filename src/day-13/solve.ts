/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import * as aoc from '../utils/aoc.js';

function areArrays(...args: any[]) {
  return Array.from(args).every(Array.isArray)
}

function areNumbers(...args: any[]) {
  return Array.from(args).every(_.isNumber)
}

function toArray(input: any) {
  return Array.isArray(input) ? input : [input]
}

function compare(left: any, right:any):number {
  // console.log('comparing', left, right)
  if (areNumbers(left, right)) {
    return left - right
  } if (areArrays(left, right)) {
    const leftSize = left.length;
    const rightSize = right.length;
    const minSize = Math.min(leftSize, rightSize)
    let returnValue = 0
    for (let i = 0; i < minSize; i += 1) {
      const rightOrder = compare(left[i], right[i])
      if (rightOrder === 0) {
        continue
      }
      if (rightOrder > 0) {
        returnValue = 1
        break
      }
      if (rightOrder < 0) {
        returnValue = -1
        break
      }
    }
    if (returnValue === 0) {
      if (leftSize === rightSize) {
        return 0
      }

      returnValue = leftSize <= rightSize ? -1 : 1
    }

    return returnValue
  }
  return compare(toArray(left), toArray(right))
}

export default function solve() {
  const content = aoc.readInput('input.txt');

  const part1Input = content.split('\n\n')
  const pairs = part1Input
    .map(c => c.split('\n')
      .map(str => JSON.parse(str)))

  const decoded = pairs.map(p => compare(p[0], p[1]))
  const indexesInRightOrder = decoded.map((p, index) => (p < 0 ? index + 1 : 0))
  console.log('PART I', _.sum(indexesInRightOrder))

  const divider1 = '[[2]]'
  const divider2 = '[[6]]'
  const part2Input = `${content.replace(/\n\n/g, '\n')}\n${divider1}\n${divider2}`
    .split('\n')
    .map(s => JSON.parse(s))
    .sort(compare)
    .map(s => JSON.stringify(s))

  const div1Index = part2Input.indexOf(divider1) + 1
  const div2Index = part2Input.indexOf(divider2) + 1

  console.log('PART II', div1Index * div2Index)
}
