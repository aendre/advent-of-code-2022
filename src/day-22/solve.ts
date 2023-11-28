import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';
import { Direction, Point2D } from '../utils/2D.js';

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
  const width = raw[height - 1].length;
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

function parseCommands(raw:string):Segment[] {
  const rows = raw.replaceAll('L', '\nL\n').replaceAll('R', '\nR\n').split('\n')
  let direction = Direction.Right; // Initial direction, where you are facing
  const rotations: { [index in Direction]?: { L: Direction, R: Direction } } = {
    [Direction.Left]: { L: Direction.Down, R: Direction.Up },
    [Direction.Up]: { L: Direction.Left, R: Direction.Right },
    [Direction.Right]: { L: Direction.Up, R: Direction.Down },
    [Direction.Down]: { L: Direction.Right, R: Direction.Left },
  }

  const segments: Segment[] = []

  rows.forEach(command => {
    if (command === 'R' || command === 'L') {
      direction = rotations[direction]![command]
    } else {
      const count = parseInt(command, 10)
      segments.push({ count, direction })
    }
  })

  return segments
}

function traverseMap(map: MonkeyMap, path: Segment, startingPosition: Point2D) {
  return startingPosition;
}

export default function solve() {
  const rawMap = aoc.inputE().split('\n').filter(row => row !== '');
  const rawSegments = rawMap.pop()!
  const segments = parseCommands(rawSegments) // raw form of the commands
  const map = parseMap(rawMap);

  let position = map.map.values().next().value // Get the first value from the map as the starting position

  segments.forEach(path => {
    position = traverseMap(map, path, position)
  })

  console.log(segments)
}
