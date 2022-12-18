import _ from 'lodash';
import * as aoc from '../utils/aoc.js';

type CraneCommand = {
  count: number;
  source: number;
  destination: number;
}

function crateMover9000(stacks: Array<Array<string>>, commands: Array<CraneCommand>) {
  commands.forEach(command => {
    for (let i = 0; i < command.count; i += 1) {
      const element = stacks[command.source].shift()
      if (typeof element !== 'undefined') {
        stacks[command.destination].unshift(element)
      }
    }
  })
}

function crateMover9001(stacks: Array<Array<string>>, commands: Array<CraneCommand>) {
  commands.forEach(command => {
    const elements = stacks[command.source].splice(0, command.count)
    stacks[command.destination].unshift(...elements)
  })
}

function topBoxes(stacks: Array<Array<string>>) {
  return stacks.map(stack => stack[0]).join('')
}

export default function solve() {
  const content = aoc.readInput('input.txt')

  const fileContent = content.split('\n');

  const stackCount = 9
  const stacks = Array.from({ length: stackCount }).map(() => [] as Array<string>)

  // Part I
  fileContent.splice(0, 8).forEach(row => {
    for (let column = 0; column < stackCount; column += 1) {
      const element = row
        .substring(column * 4, column * 4 + 4)
        .trim()
        .replace(/\[/g, '')
        .replace(/\]/g, '')
      if (element !== '') {
        stacks[column].push(element)
      }
    }
  })

  const commands = fileContent.slice(2)
    .map(command => {
      const raw = command
        .replace('move ', '')
        .replace('from ', '')
        .replace('to ', '')
        .split(' ')
        .map(num => parseInt(num, 10))
      const processedCommand:CraneCommand = {
        count: raw[0],
        source: raw[1] - 1,
        destination: raw[2] - 1,
      }

      return processedCommand
    })

  // crateMover9000(stacks, commands)
  // console.log('RESULT PART I', topBoxes(stacks));

  crateMover9001(stacks, commands)
  console.log('Level 2:', topBoxes(stacks));
}
