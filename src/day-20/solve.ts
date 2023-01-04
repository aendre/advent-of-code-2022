/* eslint-disable @typescript-eslint/no-non-null-assertion */
import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';

type IndexedValue = {
  value: number,
  index: number
}

class CircularArray {
  list : Array<IndexedValue>

  constructor(arr: number[]) {
    this.list = arr.map((v, i) => ({ value: v, index: i }))
  }

  at(index:number) {
    return this.list[this.circularToLinearIndex(index)]
  }

  atOriginalIndex(index:number) {
    return this.list.find(c => c.index === index)!
  }

  indexOfValue(val: number) {
    return this.list.findIndex(l => l.value === val)
  }

  indexOfIndex(index: number) {
    return this.list.findIndex(l => l.index === index)
  }

  circularToLinearIndex(index: number) {
    const n = this.list.length
    return ((index % n) + n) % n
  }

  movingIndex(index: number) {
    const n = this.list.length - 1
    return ((index % n) + n) % n
  }

  get size() {
    return this.list.length
  }
}

function mix(circular: CircularArray) {
  for (let i = 0; i < circular.size; i += 1) {
    const itemToShuffle = circular.atOriginalIndex(i)

    const currentIndex = circular.indexOfIndex(itemToShuffle.index)
    let resultingIndex = circular.movingIndex(currentIndex + itemToShuffle.value)
    resultingIndex = resultingIndex === 0 ? circular.list.length - 1 : resultingIndex

    circular.list.splice(currentIndex, 1)
    circular.list.splice(resultingIndex, 0, { ...itemToShuffle })
  }
}

function groveCoordinate(circular: CircularArray) {
  const zeroIndex = circular.indexOfValue(0)
  const groveCoordinates = [1000, 2000, 3000].map(i => circular.at(zeroIndex + i).value)
  return _.sum(groveCoordinates)
}

export default function solve() {
  const input = aoc.input()
    .split('\n')
    .map(Number)

  const circular = new CircularArray(input)
  mix(circular)
  console.log('Part I', groveCoordinate(circular))

  // Mix 10 times
  const circular2 = new CircularArray(input.map(i => i * 811_589_153))
  for (let i = 1; i <= 10; i += 1) {
    mix(circular2)
  }
  console.log('Part II', groveCoordinate(circular2))
}
