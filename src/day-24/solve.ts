import _ from 'lodash';
import { red } from 'ansis'
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import { commandToDirection, Point2D, Direction } from '../utils/2D.js';

function print(map:Point2D[], elf: Point2D, end: Point2D, width: number, height:number) {
  let str = `\n${width} x ${height} \n`
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const blizzards = map.filter(b => b.is([x, y]))

      if (blizzards.length) {
        str += blizzards.length === 1 ? blizzards[0].content : blizzards.length
      } else if (elf.is([x, y])) {
        str += red.bold('E')
      } else if (end.is([x, y])) {
        str += red.bold('T')
      } else {
        str += '.'
      }
    }
    if (y !== height - 1) { str += '\n' }
  }
  console.log(str)
}

function moveBlizzards(blizzards:Point2D[], width: number, height:number) {
  return blizzards.map(b => {
    if (typeof b.content === 'string') {
      const direction = commandToDirection(b.content)
      const position = b.stepOnCanvas(direction)

      if (direction === Direction.Left && position.x <= 0) {
        return b.setX(width - 2)
      }
      if (direction === Direction.Right && position.x >= width - 1) {
        return b.setX(1)
      }
      if (direction === Direction.Up && position.y <= 0) {
        return b.setY(height - 2)
      }
      if (direction === Direction.Down && position.y >= height - 1) {
        return b.setY(1)
      }

      return position;
    }
    return b
  })
}

function readBlizzards(input: string[][]) {
  const blizzards: Point2D[] = []
  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      const i = input[y][x]
      blizzards.push(new Point2D([x, y], i))
    }
  }
  return blizzards.filter(b => b.content !== '.')
}

function moveElf(elf:Point2D, blizzards:Point2D[]) : Point2D[] {
  const directions = [
    Direction.Up,
    Direction.Down,
    Direction.Left,
    Direction.Right,
    Direction.StayStill,
  ]

  const possibleMoves:Point2D[] = []

  directions.forEach(direction => {
    const movedTo = elf.stepOnCanvas(direction)
    if (
      (movedTo.x > 0
      && movedTo.y > 0
      && typeof blizzards.find(b => b.is(movedTo.xy)) === 'undefined')
      || movedTo.is([1, 0])
    ) {
      possibleMoves.push(movedTo)
    }
  })

  return possibleMoves
}

type ElfInStorm = {
  blizzards : Point2D[],
  elf: Point2D,
  minutes: number
}

function bfs(blizzards: Point2D[], elf:Point2D, target:Point2D, width: number, height:number) {
  const visited = new Set<string>();
  const root = { blizzards, elf, minutes: 0 }
  const queue:ElfInStorm[] = [root];

  let iter = 0
  while (queue.length) {
    const storm:ElfInStorm = queue.shift()!; // mutates the queue
    // print(storm.blizzards, storm.elf, target, width, height)

    iter += 1

    if (storm.elf.key === target.key) {
      console.log(`Found it after ${storm.minutes} minutes, and ${iter} iterations`)
      return iter
    }

    const newBlizzards = moveBlizzards(storm.blizzards, width, height);
    const elfMoves = moveElf(storm.elf, newBlizzards);
    const elfMovesDistance = elfMoves.map(e => ({
      elf: e,
      distance: e.manhattanDistanceTo(target),
    })).sort((a, b) => b.distance - a.distance)

    const newStates:ElfInStorm[] = elfMovesDistance.map(e => ({
      blizzards: [...newBlizzards],
      elf: e.elf,
      minutes: storm.minutes + 1,
    }))

    if (newStates.length) {
      queue.push(...newStates)
    }
  }
  console.log(`Exiting after ${iter}`)
  return Infinity
}

export default function solve() {
  const input = new aoc.AocInput()
    .useExample()
    .lines
    .map(line => line.split(''))

  const height = input.length;
  const width = input[0].length;

  let elf = new Point2D([1, 0])
  const target = new Point2D([width - 2, height - 1])
  let blizzards = readBlizzards(input);

  // print(blizzards, elf, target, width, height)
  // blizzards = moveBlizzards(blizzards, width, height);
  // blizzards = moveBlizzards(blizzards, width, height);
  // blizzards = moveBlizzards(blizzards, width, height);

  // print(blizzards, elf, target, width, height)

  bfs(blizzards, elf, target, width, height)

  // print(blizzards, elf, width, height)
}
