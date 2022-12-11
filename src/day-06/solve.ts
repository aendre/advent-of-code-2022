import _ from 'lodash';
import math from '../utils/mathUtils.js'
import { readInput } from '../utils/aoc.js';

function isUnique(input: string) {
  const sequence = Array.from(input)
  return _.uniq(sequence).length === input.length
}

export default function solve() {
  const content = readInput('input.txt')

  const input = content;
  const windowSize = 4;
  for (let i = 0; i < input.length - windowSize; i += 1) {
    const signal = input.substring(i, i + windowSize);
    if (isUnique(signal)) {
      console.log('result', i + windowSize)
      break;
    }
  }
}
