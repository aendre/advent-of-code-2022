import _ from 'lodash';
import * as aoc from '../utils/aoc.js';

export type MatchScore = {
  opponent: string,
  you: string
  expected: number
};

function mapToSameInput(symbol: string) {
  return symbol.replace('X', 'A')
    .replace('Y', 'B')
    .replace('Z', 'C')
}

function calculateSymbolScore(symbol: string) {
  const map = new Map<string, number>()
  map.set('A', 1)
  map.set('B', 2)
  map.set('C', 3)

  return map.get(symbol) || 0
}

function mapExpectedScore(symbol: string) {
  const map = new Map<string, number>()
  map.set('A', 0)
  map.set('B', 3)
  map.set('C', 6)

  return map.get(symbol) || 0
}

function calculateGameScore(match: MatchScore) {
  if (match.opponent === match.you) {
    return 3;
  }
  if (match.you === 'A') {
    return match.opponent === 'B' ? 0 : 6;
  }
  if (match.you === 'B') {
    return match.opponent === 'C' ? 0 : 6;
  }
  // you === C
  return match.opponent === 'A' ? 0 : 6;
}

function getSymbolToFilfull(match: MatchScore) {
  const table: Record<string, { win:string, loose:string }> = {
    A: { win: 'B', loose: 'C' },
    B: { win: 'C', loose: 'A' },
    C: { win: 'A', loose: 'B' },
  };

  if (match.expected === 3) {
    return match.opponent;
  }
  if (match.expected === 6) {
    return table[match.opponent].win;
  }

  return table[match.opponent].loose;
}

export default function solve() {
  const fileInput = aoc.readInput('input.txt')
  const matches = fileInput.split('\n')
    .map(row => mapToSameInput(row))
    .map(round => {
      const play = _.split(round, ' ');
      return {
        opponent: play[0],
        you: play[1],
        expected: mapExpectedScore(play[1]),
      };
    })

  const result = matches.map(match => calculateGameScore(match) + calculateSymbolScore(match.you))
  console.log('RESULT PART I', _.sum(result));

  const result2 = matches
    .map(match => match.expected + calculateSymbolScore(getSymbolToFilfull(match)));
  console.log('RESULT PART II', _.sum(result2));
}
