import math from '../utils/math.js'

export type Coordinate = [number, number];

export function commandToDirection(command:string): Coordinate {
  switch (command.toLowerCase()) {
    case 'u':
    case 'up':
    case '^':
    case 'n':
    case 'north':
      return [0, 1];

    case 'l':
    case 'left':
    case '<':
    case 'w':
    case 'west':
      return [-1, 0];

    case 'r':
    case 'right':
    case '>':
    case 'e':
    case 'east':
      return [1, 0]

    case 'd':
    case 'down':
    case 'v':
    case 's':
    case 'south':
      return [0, -1]

    // Diagonal direction
    case 'ne':
      return [1, 1]
    case 'nw':
      return [-1, 1]
    case 'se':
      return [1, -1]
    case 'sw':
      return [-1, -1]

    default:
      return [0, 0]
  }
}

export class Point2D {
  private point : Coordinate

  constructor(p: Coordinate) {
    this.point = p
  }

  moveTo(moveBy: Coordinate | string) {
    const move = typeof moveBy === 'string' ? commandToDirection(moveBy) : moveBy
    return new Point2D(math.add(this.point, move))
  }

  get key() {
    return `${this.x}-${this.y}`
  }

  get x() {
    return this.point[0]
  }

  get y() {
    return this.point[1]
  }

  get xy() {
    return this.point
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
    }
  }
}
export function boundingBox(points: Point2D[]) {
  return {
    x: {
      min: Math.min(...points.map(c => c.x)),
      max: Math.max(...points.map(c => c.x)),
    },
    y: {
      min: Math.min(...points.map(c => c.y)),
      max: Math.max(...points.map(c => c.y)),
    },
  }
}
