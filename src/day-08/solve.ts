import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import math from '../utils/mathUtils.js'
import { readFromFolder } from '../utils/fileUtils.js';
import { patternMatch } from '../utils/stringutils.js';

function isVisible(tree: number, direction:number[][]) {
  return direction.some(col => col.every(c => c < tree))
}

function scenicScore(tree: number, direction:number[][]) {
  const scores = direction.map(d => {
    let score = 0
    for (let i = 0; i < d.length; i += 1) {
      score += 1
      if (d[i] > tree || d[i] === tree) {
        break
      }
    }
    return score
  })

  return scores.reduce((a, b) => a * b)
}

export default function solve() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const content = readFromFolder(dirname, 'input.txt')

  const forest = content.split('\n').map(s => [...s].map(Number));
  const width = forest[0].length;
  const height = forest.length;

  let innerVisible = 0
  const scenicScores = []

  for (let x = 1; x < width - 1; x += 1) {
    for (let y = 1; y < height - 1; y += 1) {
      const directions = [
        _.flatten(math.column(forest, y)).slice(0, x).reverse(), // up
        _.flatten(math.column(forest, y)).slice(x + 1), // down
        forest[x].slice(0, y).reverse(), // left
        forest[x].slice(y + 1), // right
      ];
      const currentTree = forest[x][y];

      innerVisible += isVisible(currentTree, directions) ? 1 : 0
      scenicScores.push(scenicScore(currentTree, directions))
    }
  }
  const visibleTreesFromTheEdge = 2 * width + 2 * (height - 2)
  const visible = visibleTreesFromTheEdge + innerVisible;
  console.log('PART I', visible)
  console.log('PART II', _.max(scenicScores))
}
