import _ from 'lodash';

export function leadingZeroDay(day: string | number) {
  return (`0${day}`).slice(-2); // Day with leadin zeroes
}

export function patternMatch(input: string, matcher:string) {
  // https://digitalfortress.tech/tips/top-15-commonly-used-regex/
  // https://javascript.plainenglish.io/the-7-most-commonly-used-regular-expressions-in-javascript-bb4e98288ca6
  const regExpMap:Record<string, string> = {
    $int: '(\\d+)',
    $str: '([a-zA-Z]+)',
    $float: '(\\d*\\.\\d+)',
  }

  const tokenMatcher = `${Object.keys(regExpMap).map(_.escapeRegExp).map(c => `(${c})`).join('|')}`

  const tokens = matcher.match(new RegExp(tokenMatcher, 'g'))
  if (tokens === null) {
    throw new Error('No tokens were found in the input string')
  }

  let finalRegExp = matcher;
  Object.keys(regExpMap).forEach(key => {
    finalRegExp = finalRegExp.replace(new RegExp(_.escapeRegExp(key), 'g'), regExpMap[key])
  })

  const match = input.match(new RegExp(finalRegExp));

  if (match === null) {
    return tokens.map(t => null)
    throw new Error('Cannot match the regular expresion')
  }

  return match.slice(1)
}
