import _ from 'lodash';
import * as aoc from '../utils/aoc.js';

export default function solve() {
  const fileContent = aoc.readInput('input.txt')

  // Part I
  const result = fileContent.split('\n\n')
    .map(calories => calories
      .split('\n')
      .map(Number))
    .map(_.sum)

  console.log('RESULT PART I', _.max(result));

  // Part II
  result.sort((a:number, b:number) => b - a);
  const top3 = result.slice(0, 3);
  console.log('RESULT PART II', _.sum(top3));
}
