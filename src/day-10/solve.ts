import _ from 'lodash';
import math from '../utils/mathUtils.js'
import { patternMatch } from '../utils/stringutils.js';
import { readInput } from '../utils/aoc.js';

export default function solve() {
  const content = readInput('input.txt')

  const ticks:number[] = []
  content.split('\n').forEach(r => {
    ticks.push(0)
    const [c, n] = r.split(' ')
    if (c === 'addx') {
      ticks.push(Number(n))
    }
  })

  let X = 1;
  const cyclesToCheck = [20, 60, 100, 140, 180, 220]
  const strengths = []
  const crt = []

  for (let tick = 0; tick < ticks.length; tick += 1) {
    X += ticks[tick - 1] ?? 0// console.log(ticks)
    if (cyclesToCheck.includes(tick + 1)) {
      strengths.push(X * (tick + 1))
    }

    const crtCycle = tick - 40 * (Math.floor(tick / 40))
    const char = (crtCycle >= X - 1 && crtCycle <= X + 1) ? '#' : ' '
    crt.push(char)
  }

  console.log('PART I', _.sum(strengths))
  console.log('PART II:')
  _.chunk(crt, 40).forEach(t => console.log(t.join('')))
}
