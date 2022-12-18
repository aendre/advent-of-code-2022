/* eslint-disable no-constant-condition */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-use-before-define */
import _ from 'lodash';
import graphlib, { Graph } from '@dagrejs/graphlib'
import math from '../utils/mathUtils.js'
import * as aoc from '../utils/aoc.js';

type Cube = [number, number, number]

type BoundingBox = {
  [key:number]: {
    min: number;
    max: number;
  };
}

function toCubeCoordinates(c:string) {
  return c.split(',').map(Number) as Cube
}

function get3DBoundingBox(cubes:Cube[]):BoundingBox {
  return {
    0: {
      min: Math.min(...cubes.map(c => c[0])),
      max: Math.max(...cubes.map(c => c[0])),
    },
    1: {
      min: Math.min(...cubes.map(c => c[1])),
      max: Math.max(...cubes.map(c => c[1])),
    },
    2: {
      min: Math.min(...cubes.map(c => c[2])),
      max: Math.max(...cubes.map(c => c[2])),
    },
  }
}

function getSides(c:Cube): Cube[] {
  return [
    [c[0] - 1, c[1], c[2]],
    [c[0] + 1, c[1], c[2]],
    [c[0], c[1] - 1, c[2]],
    [c[0], c[1] + 1, c[2]],
    [c[0], c[1], c[2] - 1],
    [c[0], c[1], c[2] + 1],
  ]
}

function generateAllCubes(cubes: Cube[]) {
  const bb = get3DBoundingBox(cubes);
  const all:Cube[] = []
  for (let x = bb[0].min; x <= bb[0].max; x += 1) {
    for (let y = bb[1].min; y <= bb[1].max; y += 1) {
      for (let z = bb[2].min; z <= bb[2].max; z += 1) all.push([x, y, z])
    }
  }
  return all
}

function toCubeKey(c: Cube) {
  return c.join(',')
}

function isCubeReachedInDirection(c: Cube, cubes: Set<string>, bb:BoundingBox, axis:number, step:number) {
  let p = c[axis]
  while (true) {
    p += step

    const temp = [...c]
    temp[axis] = p
    const tempKey = toCubeKey(temp as Cube)
    if (cubes.has(tempKey)) {
      return true
    }

    if (p >= bb[axis].max || p <= bb[axis].min) {
      return false
    }
  }
}

// Check if all 6 directions of Cube "c" hits another cube
function isInsetCube(c: Cube, cubes: Set<string>, bb:BoundingBox) {
  return isCubeReachedInDirection(c, cubes, bb, 0, 1)
  && isCubeReachedInDirection(c, cubes, bb, 0, -1)
  && isCubeReachedInDirection(c, cubes, bb, 1, 1)
  && isCubeReachedInDirection(c, cubes, bb, 1, -1)
  && isCubeReachedInDirection(c, cubes, bb, 2, 1)
  && isCubeReachedInDirection(c, cubes, bb, 2, -1)
}

function surfaceAreas(cubes:Cube[]) {
  const cubeSet = new Set(cubes.map(toCubeKey))

  return _.sum(cubes.map(c => getSides(c)
    .map(toCubeKey)
    .filter(s => !cubeSet.has(s))
    .length))
}

export default function solve() {
  const input = aoc.input().split('\n')

  const cubes = input.map(toCubeCoordinates)
  const surfaceArea = surfaceAreas(cubes);
  console.log('Part I', surfaceArea)

  const cubeSet = new Set(cubes.map(toCubeKey))
  const bb = get3DBoundingBox(cubes);
  const semiInnerCubes = generateAllCubes(cubes)
    .filter(c => !cubeSet.has(toCubeKey(c)))
    .filter(c => isInsetCube(c, cubeSet, bb))

  const innerCubeSet = new Set(semiInnerCubes.map(toCubeKey))
  const innerCubes = semiInnerCubes
    .filter(c => getSides(c)
      .map(toCubeKey)
      .every(cc => cubeSet.has(cc) || innerCubeSet.has(cc)))

  const innerCubeSurface = surfaceAreas(innerCubes)
  const externalSurfaceArea = surfaceArea - innerCubeSurface

  console.log('Part II', externalSurfaceArea)
}
