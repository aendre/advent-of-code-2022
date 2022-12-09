import { createCanvas } from 'canvas';
import chroma from 'chroma-js';
import fs from 'fs'
import _ from 'lodash';
import { create } from 'mathjs';
import { Knot, Position } from '../solve';

type ColoredKnot = Knot & {
  color: string
}

type MotionRange = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
}

function calculateMotionRange(pos:Position[]): MotionRange {
  const xMin = _.min(pos.map(p => p.x)) ?? 0
  const xMax = _.max(pos.map(p => p.x)) ?? 0
  const yMin = _.min(pos.map(p => p.y)) ?? 0
  const yMax = _.max(pos.map(p => p.y)) ?? 0

  return {
    xMin,
    xMax,
    yMin,
    yMax,
    width: Math.abs(xMin) + Math.abs(xMax) + 1,
    height: Math.abs(yMin) + Math.abs(yMax) + 1,
  }
}

function createRopeImage(rope:ColoredKnot[], motionRange: MotionRange, step = 0) {
  // Dimensions for the image
  const { width, height } = motionRange;
  const magnify = 3

  // Instantiate the canvas object
  const canvas = createCanvas(width * magnify, height * magnify);
  const context = canvas.getContext('2d');

  // Fill the rectangle with purple
  context.fillStyle = '#444444';
  context.fillRect(0, 0, width * magnify, height * magnify);

  rope.forEach(knot => {
    context.fillStyle = knot.color
    const x = knot.history[step].x + Math.abs(motionRange.xMin)
    const y = motionRange.height - knot.history[step].y - Math.abs(motionRange.yMin) - 1
    context.fillRect(x * magnify, y * magnify, magnify, magnify);
  })

  // Write the image to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./src/day-09/bonus/images/image-${step}.png`, buffer);
}

export default function drawRopeSimulation(rope:Knot[], frameLimit = 1) {
  const knotCount = rope.length;
  const colorScheme = chroma.bezier(['red', 'yellow']).scale().colors(knotCount)
  const coloredRope = rope.map((r, index) => ({ ...r, color: colorScheme[index] }))

  const headMotions = rope[0].history
  const motionRange = calculateMotionRange(headMotions)

  for (let i = 0; i < frameLimit; i += 1) {
    createRopeImage(coloredRope, motionRange, i)
  }

  console.log('Nr of frames:', headMotions.length)
  console.log('Image size:', motionRange)
}
