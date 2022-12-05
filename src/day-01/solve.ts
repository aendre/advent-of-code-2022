import _ from 'lodash';
import { readInputFile } from '../utils/readFile.js';

export default function solve() {
  const fileContent = readInputFile('day-01/example.txt');

  // Part I
  const result = fileContent.split('\n\n')
    .map(calories => calories
      .split('\n')
      .map(cal => Number(cal)))
    .map(calories => _.sum(calories))

  console.log('RESULT PART I', _.max(result));

  // Part II
  result.sort((a:number, b:number) => b - a);
  const top3 = result.slice(0, 3);
  console.log('RESULT PART II', _.sum(top3));
}
