import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';

function snafuToDecimal(decimal:number):string {
  let d = decimal;

  let res = '';
  while (d > 0) {
    switch (d % 5) {
      case 0: res = `0${res}`; break;
      case 1: res = `1${res}`; break;
      case 2: res = `2${res}`; break;
      case 3: d += 5; res = `=${res}`; break;
      case 4: d += 5; res = `-${res}`; break;
    }
    d = (d - (d % 5)) / 5;
  }
  return res;
}

function decimalToSnafu(input: string):number {
  return _.sum(input.split('').reverse().map((digit, pow) => {
    let number = parseInt(digit, 10)
    if (Number.isNaN(number)) {
      if (digit === '-') {
        number = -1;
      } else if (digit === '=') {
        number = -2
      }
    }

    return ((5 ** pow) * number)
  }))
}

export default function solve() {
  const input = aoc.input().split('\n');

  const converted = input.map(decimalToSnafu)
  const bobDecimal = _.sum(converted)
  console.log(snafuToDecimal(bobDecimal))
}
