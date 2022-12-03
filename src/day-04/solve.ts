import _ from 'lodash';
import { readInputFile } from '../utils/readFile.js';

export default function solve() {
  const fileContent = readInputFile('day-04/example.txt');

  // Part I
  const result = fileContent.split('\n')

  console.log(result)

  // console.log('RESULT PART I', _.sum(result));

  // Part II
  // console.log('RESULT PART II', _.sum(priorities));
}
