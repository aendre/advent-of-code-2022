/* eslint-disable no-param-reassign */
import _ from 'lodash';
import math from '../utils/mathUtils.js'
import { patternMatch } from '../utils/stringutils.js';
import { readInput } from '../utils/aoc.js';

export default function solve() {
  const content = readInput('input.txt')

  const monkeys = content.split('\n\n').map(row => {
    const [monkey, items, operation, divisible, yesToMonkey, noToMonkey] = row.replace('  Starting items: ', '')
      .replace('Operation: new =', '')
      .replace('  Test: divisible by ', '')
      .replace('    If true: throw to monkey ', '')
      .replace('    If false: throw to monkey ', '')
      .split('\n')

    return {
      items: items.split(', ').map(Number),
      operation: operation.trim(),
      divideBy: Number(divisible),
      yesToMonkey: Number(yesToMonkey),
      noToMonkey: Number(noToMonkey),
      inspectionCount: 0,
    }
  })

  const scaleDownBy = monkeys.map(m => m.divideBy).reduce((a, b) => a * b)
  const nrOfRounds = 10_000;
  _.times(nrOfRounds).forEach(() => {
    monkeys.forEach((monkey, monkeyIndex) => {
      monkey.items.forEach(item => {
        // Calculate worry level
        const worryLevel = monkey.operation.replace(/old/g, `${item}`);
        // const newWorryLevel = Math.floor(math.evaluate(worryLevel) / 3) // Part 1
        const newWorryLevel = math.evaluate(worryLevel) % scaleDownBy // Part 2

        // Throw item to monkey
        const pushToMonkey = newWorryLevel % monkey.divideBy === 0 ? monkey.yesToMonkey : monkey.noToMonkey;
        monkeys[pushToMonkey].items.push(newWorryLevel)

        monkey.inspectionCount += 1
      })
      monkey.items = []
    })
  })

  const monkeyBusiness = monkeys
    .map(m => m.inspectionCount) // map to inspectionCounts
    .sort((a:number, b:number) => b - a) // Sort
    .slice(0, 2) // Top 2 monkeys
    .reduce((a, b) => a * b) // Multiple all elements

  console.log('RESULT', monkeyBusiness)
}
