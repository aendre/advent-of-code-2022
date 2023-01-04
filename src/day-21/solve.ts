import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';

function toOperation(expression: string) {
  return {
    left: expression.slice(0, 4),
    right: expression.slice(7),
    operator: expression.slice(5, 6),
  }
}

function isNumberExpression(expression:string): boolean {
  return !Number.isNaN(Number(expression))
}

class MonkeyCode {
  monkeys = new Map<string, string>()

  HUMAN = 'humn'

  constructor(input: string[]) {
    input.forEach(m => {
      const id = m.slice(0, 4)
      const expression = m.slice(6)
      this.monkeys.set(id, expression)
    })
  }

  yelledNumber(id:string, human?: number):number {
    const expression = this.monkeys.get(id)
    const parsedNumber = Number(expression)

    if (typeof expression !== 'undefined' && !isNumberExpression(expression)) {
      const operation = toOperation(expression)
      return math.evaluate(this.yelledNumber(operation.left) + operation.operator + this.yelledNumber(operation.right))
    }
    return parsedNumber
  }

  hasHumanInvolved(id:string) : boolean {
    const expression = this.monkeys.get(id)
    const parsedNumber = Number(expression)

    if (typeof expression !== 'undefined' && Number.isNaN(parsedNumber)) {
      const operation = toOperation(expression)
      if (operation.left === this.HUMAN || operation.right === this.HUMAN) {
        return true
      }
      return this.hasHumanInvolved(operation.left) || this.hasHumanInvolved(operation.right)
    }
    return id === this.HUMAN
  }

  calculateHumanYell(root: string, result: number): number {
    if (root === this.HUMAN) {
      return result
    }

    const expression = this.monkeys.get(root)
    if (typeof expression !== 'undefined' && !isNumberExpression(expression)) {
      const operation = toOperation(expression)
      const leftExpressionContainsHuman = this.hasHumanInvolved(operation.left)
      const constantId = leftExpressionContainsHuman ? operation.right : operation.left
      const variableId = leftExpressionContainsHuman ? operation.left : operation.right
      const constantValue = this.yelledNumber(constantId)

      let transformedMathExpression = ''
      switch (operation.operator) {
        case '/':
          transformedMathExpression = leftExpressionContainsHuman ? `${result} * ${constantValue}` : `${constantValue} / ${result}`;
          break;
        case '+':
          transformedMathExpression = `${result} - ${constantValue}`
          break;
        case '*':
          transformedMathExpression = `${result} / ${constantValue}`
          break;
        case '-':
          transformedMathExpression = leftExpressionContainsHuman ? `${result} + ${constantValue}` : `${constantValue} - ${result}`;
          break;
      }

      return this.calculateHumanYell(variableId, math.evaluate(transformedMathExpression))
    }

    return NaN
  }
}

export default function solve() {
  const input = aoc.input()
    .split('\n');

  const code = new MonkeyCode(input)

  console.log('Part I', code.yelledNumber('root'))
  console.log('Part II', code.calculateHumanYell('lttc', code.yelledNumber('pfjc')))
}
