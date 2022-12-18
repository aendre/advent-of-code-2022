/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';

type P = {
  x:number;
  y:number;
}

function manhattanDistance(a:P, b:P) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

class Sensor {
  sensor: P

  beacon: P

  constructor(...args: number[]) {
    this.sensor = { x: args[0], y: args[1] }
    this.beacon = { x: args[2], y: args[3] }
  }

  get radius() {
    return manhattanDistance(this.sensor, this.beacon)
  }

  // Get the ranges the sensor convers on both axes
  get area() {
    return {
      xMin: this.sensor.x - this.radius,
      xMax: this.sensor.x + this.radius,
      yMin: this.sensor.y - this.radius,
      yMax: this.sensor.y + this.radius,
    }
  }

  // Return true if "beacon" is in the range of the sensor
  covers(beacon:P) {
    return manhattanDistance(this.sensor, beacon) <= this.radius
  }

  // For a given y, return the range on the x axis this sensor convers
  coveringRange(y:number) {
    const range = (this.radius) - Math.abs(this.sensor.y - y)
    const diff = range < 0 ? 0 : range
    return {
      start: range < 0 ? null : this.sensor.x - diff,
      end: range < 0 ? null : this.sensor.x + diff,
    }
  }
}

// Get the maximum covered area by several sensors
function getCoverArea(sensors: Sensor[]) {
  const areas = sensors.map(s => s.area)
  return {
    xMin: _.minBy(areas, 'xMin')!.xMin,
    xMax: _.maxBy(areas, 'xMax')!.xMax,
    yMin: _.minBy(areas, 'yMin')!.yMin,
    yMax: _.maxBy(areas, 'yMax')!.yMax,
  }
}

function part1(sensors: Sensor[]) {
  const coveredArea = getCoverArea(sensors)

  let covered = 0;
  const y = 2_000_000
  for (let x = coveredArea.xMin; x <= coveredArea.xMax; x += 1) {
    covered += sensors.some(s => s.covers({ x, y })) ? 1 : 0
  }

  const beaconsInY = _.uniq(sensors
    .filter(s => s.beacon.y === y)
    .map(s => `${s.beacon.x}-${s.beacon.y}`))
    .length

  console.log('Part I', covered - beaconsInY)
}

function part2(sensors: Sensor[], file:string) {
  let distressBeacon = { x: 0, y: 0 }
  const lowerLimit = 0
  const upperLimit = file === 'input.txt' ? 4_000_000 : 20

  outerLoop:
  for (let y = lowerLimit; y <= upperLimit; y += 1) {
    // Get all ranges on the X axis for each sensor
    let ranges = sensors.map(s => s.coveringRange(y))

    let x = lowerLimit
    while (x <= upperLimit) {
      // Get the ranges
      const inRangeSensors = ranges.filter(r => r.start !== null && r.end !== null && _.inRange(x, r.start, r.end + 1))

      // Get the maxium range covered by a sensor and continue searching from there
      const maxRange = _.maxBy(inRangeSensors, 'end')

      // We have the solution!
      if (typeof maxRange === 'undefined') {
        distressBeacon = { x, y }
        break outerLoop
      }
      x = maxRange.end + 1
    }
  }

  const tuningFrequency = distressBeacon.x * 4_000_000 + distressBeacon.y
  console.log(distressBeacon)
  console.log('Part II', tuningFrequency)
}

export default function solve() {
  const fileName = 'input.txt';
  const content = aoc.readInput(fileName)
    .split('\n')
    .map(s => aoc.patternMatch(s, 'Sensor at x=$signedint, y=$signedint: closest beacon is at x=$signedint, y=$signedint') as number[])

  const sensors = content.map(c => new Sensor(...c))

  part1(sensors)
  part2(sensors, fileName)
}
