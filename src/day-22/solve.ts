import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import { Direction, Point2D, oppositeDirection } from '../utils/2D.js';

type Segment = {
  count: number,
  direction: Direction
}
type MonkeyMap = {
  width: number;
  height: number;
  map: Map<string, Point2D>;
}

function parseMap(raw: string[]) : MonkeyMap {
  const height = raw.length;
  const width = Math.max(...raw.map(i => i.length));
  const map: Map<string, Point2D> = new Map();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const content = raw[y][x];
      if (typeof content !== 'undefined' && content !== ' ') {
        const point = new Point2D([x, y], content);
        map.set(point.key, point)
      }
    }
  }
  return { width, height, map }
}

function parseCommands(raw:string):Direction[] {
  const rows = raw.replaceAll('L', '\nL\n').replaceAll('R', '\nR\n').split('\n')
  let direction = Direction.Right; // Initial direction, where you are facing
  const rotations: { [index in Direction]?: { L: Direction, R: Direction } } = {
    [Direction.Left]: { L: Direction.Down, R: Direction.Up },
    [Direction.Up]: { L: Direction.Left, R: Direction.Right },
    [Direction.Right]: { L: Direction.Up, R: Direction.Down },
    [Direction.Down]: { L: Direction.Right, R: Direction.Left },
  }

  const directions: Direction[] = []

  rows.forEach(command => {
    if (command === 'R' || command === 'L') {
      direction = rotations[direction]![command]
    } else {
      const count = parseInt(command, 10)
      Array(count).fill('').forEach(() => {
        directions.push(direction)
      })
    }
  })

  return directions
}

function goToOtherSide(map:MonkeyMap, direction: Direction, position: Point2D): Point2D {
  const opposite = oppositeDirection(direction)
  let point = position.stepOnCanvas(opposite)

  // start walking the other way until you fall off the map again
  while (typeof map.map.get(point.key) !== 'undefined') {
    point = point.stepOnCanvas(opposite)
  }

  // Take one step back
  return point.stepOnCanvas(direction)
}

function traverseMap(map: MonkeyMap, direction: Direction, startingPosition: Point2D) {
  let nextTile = startingPosition.stepOnCanvas(direction)
  let mapElement = map.map.get(nextTile.key)

  // We went off the map, get a new next position
  if (typeof mapElement === 'undefined') {
    nextTile = goToOtherSide(map, direction, nextTile)
    mapElement = map.map.get(nextTile.key)
  }

  // If we are still off the map, we fucked up something
  if (typeof mapElement === 'undefined') {
    throw ('Error, you went off the map again')
  }

  // We can move here, it's a free spot
  if (mapElement.content === '.') {
    return nextTile;
  }

  // We hit the wall, stay still
  return startingPosition
}

function getPassword(position: Point2D, direction: Direction) {
  const row = position.y + 1;
  const column = position.x + 1;
  let facing = 0;
  switch (direction) {
    case Direction.Right: facing = 0; break;
    case Direction.Down: facing = 1; break;
    case Direction.Left: facing = 2; break;
    case Direction.Up: facing = 3; break;
  }

  return (1000 * row) + (4 * column) + facing
}

export default function solve() {
  const rawMap = aoc.input().split('\n').filter(row => row !== '');
  const rawCommand = rawMap.pop()!
  const directions = parseCommands(rawCommand) // raw form of the commands
  const map = parseMap(rawMap);

  let position = map.map.values().next().value // Get the first value from the map as the starting position
  directions.forEach(direction => {
    position = traverseMap(map, direction, position)
  })

  // 158170 - too high
  console.log(getPassword(position, _.last(directions)!))
}
