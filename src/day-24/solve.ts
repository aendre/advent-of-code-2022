import _ from 'lodash';
import { red } from 'ansis'
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import { commandToDirection, Point2D, Direction } from '../utils/2D.js';

type Blizzards = {
  blizzards : Point2D[],
  blizzardsIndex: Set<string>,
  width: number,
  height: number
}

type ElfInStorm = {
  elf: Point2D,
  minutes: number
}

function createBlizzardIndex(blizzards:Point2D[]): Set<string> {
  return new Set(blizzards.map(b => b.key))
}

function print(map:Blizzards, elf: Point2D, end: Point2D) {
  let str = `\n${map.width} x ${map.height} \n`
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const blizzards = map.blizzards.filter(b => b.is([x, y]))

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
    if (y !== map.height - 1) { str += '\n' }
  }
  console.log(str)
}

function moveBlizzards(blizzardMap:Blizzards) :Blizzards {
  const blizzards = blizzardMap.blizzards.map(b => {
    if (typeof b.content === 'string') {
      const direction = commandToDirection(b.content)
      const position = b.stepOnCanvas(direction)

      if (direction === Direction.Left && position.x <= 0) {
        return b.setX(blizzardMap.width - 2)
      }
      if (direction === Direction.Right && position.x >= blizzardMap.width - 1) {
        return b.setX(1)
      }
      if (direction === Direction.Up && position.y <= 0) {
        return b.setY(blizzardMap.height - 2)
      }
      if (direction === Direction.Down && position.y >= blizzardMap.height - 1) {
        return b.setY(1)
      }

      return position;
    }
    return b
  })

  return {
    blizzards,
    blizzardsIndex: createBlizzardIndex(blizzards),
    width: blizzardMap.width,
    height: blizzardMap.height,
  }
}

function readBlizzards(input: string[][]): Blizzards {
  const blizzards: Point2D[] = []
  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      const i = input[y][x]
      if (i !== '.') {
        blizzards.push(new Point2D([x, y], i))
      }
    }
  }
  return {
    blizzards,
    blizzardsIndex: createBlizzardIndex(blizzards),
    width: input[0].length,
    height: input.length,
  }
}

function moveElf(elf:Point2D, blizzardMap:Blizzards) : Point2D[] {
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
      (
        movedTo.x > 0
        && movedTo.x < blizzardMap.width - 1
        && movedTo.y > 0
        && movedTo.y < blizzardMap.height - 1
        && !blizzardMap.blizzardsIndex.has(movedTo.key)
      )
      || movedTo.is([1, 0])
      || movedTo.is([blizzardMap.width - 2, blizzardMap.height - 1])
    ) {
      possibleMoves.push(movedTo)
    }
  })

  return possibleMoves
}

// eslint-disable-next-line func-names
let blizzardsAfterStorm = function (minutes: number, blizzardMap: Blizzards) : Blizzards {
  if (minutes <= 0) {
    return blizzardMap
  }
  if (minutes === 1) {
    return moveBlizzards(blizzardMap)
  }
  return moveBlizzards(blizzardsAfterStorm(minutes - 1, blizzardMap))
}

blizzardsAfterStorm = _.memoize(blizzardsAfterStorm)

function bfs(blizzards: Blizzards, elf:Point2D, target:Point2D, initMinutes = 0) : number {
  const root = { elf, minutes: initMinutes }
  const visited = new Set<string>();
  const queue:ElfInStorm[] = [root];

  let iter = 0
  while (queue.length) {
    const storm:ElfInStorm = queue.shift()!; // mutates the queue
    // print(storm.blizzards, storm.elf, target, width, height)

    iter += 1

    if (storm.elf.key === target.key) {
      console.log(`Found it after ${storm.minutes - 1} minutes, and ${iter} iterations`)
      return storm.minutes - 1
    }

    const newBlizzards = blizzardsAfterStorm(storm.minutes, blizzards);
    const newElfMoves = moveElf(storm.elf, newBlizzards);

    const nextMinute = storm.minutes + 1
    newElfMoves.forEach(newElfPosition => {
      if (!visited.has(`${newElfPosition.key}-${nextMinute}`)) {
        visited.add(`${newElfPosition.key}-${nextMinute}`);
        const queueElement = {
          elf: newElfPosition,
          minutes: storm.minutes + 1,
        }
        queue.push(queueElement);
      }
    })
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

  const elf = new Point2D([1, 0])
  const target = new Point2D([width - 2, height - 1])
  const blizzards = readBlizzards(input);

  const time1 = bfs(blizzards, elf, target)
  const time2 = bfs(blizzards, target, elf, time1)
  const time3 = bfs(blizzards, elf, target, time2)
  console.log(time1, time2, time3)
}
