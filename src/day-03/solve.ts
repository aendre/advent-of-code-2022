import _ from 'lodash';
import * as aoc from '../utils/aoc.js';

function splitToChars(input: string) {
  return Array.from(input);
}

function isUpperCase(input:string) {
  return input === input.toUpperCase()
}

function assignPriority(input:string) {
  return input.toLowerCase().charCodeAt(0) - 96 + (isUpperCase(input) ? 26 : 0)
}

export default function solve() {
  const fileContent = aoc.readInput('input.txt')

  // Part I
  const result = fileContent.split('\n')
    .map(rucksack => {
      const compartimentSize = rucksack.length / 2;
      return [
        rucksack.slice(0, compartimentSize),
        rucksack.slice(compartimentSize),
      ].map(splitToChars)
    })
    .map(compartiments => _.intersection(...compartiments))
    .map(rucksack => _.head(rucksack) ?? '')
    .map(commonLetter => assignPriority(commonLetter))

  console.log('RESULT PART I', _.sum(result));

  // Part II
  const rows = fileContent.split('\n')
    .map(splitToChars);

  const groups = _.chunk(rows, 3)
  const priorities = groups
    .map(group => _.intersection(...group))
    .map(group => _.head(group) ?? '')
    .map(assignPriority)

  console.log('RESULT PART II', _.sum(priorities));
}
