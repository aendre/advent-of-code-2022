/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import * as aoc from '../utils/aoc.js';

type Node = {
  x:number;
  y:number;
  char:string;
  code:number;
  key: string;
}

type LinkedNode = Node & {
  parent: LinkedNode | null;
}

function getNodeOfChar(nodes:Node[][], char:string) {
  const x = nodes.findIndex(r => r.map(a => a.char).includes(char))
  const y = nodes[x].findIndex(c => c.char === char)
  return nodes[x][y]
}

function getNeighbours(nodes:Node[][], node: Node): Node[] {
  return _.compact([
    { x: node.x, y: node.y + 1 },
    { x: node.x, y: node.y - 1 },
    { x: node.x - 1, y: node.y },
    { x: node.x + 1, y: node.y },
  ].map(c => (nodes[c.x] ? nodes[c.x][c.y] : undefined)))
}

function toNode(char:string, x:number, y:number) {
  return {
    x,
    y,
    char,
    get code() {
      return this.char.charCodeAt(0)
    },
    get key() {
      return `${this.x}-${this.y}`
    },
  }
}

function getRouteSize(node:LinkedNode, size = 0) :number {
  return node.parent === null ? size : getRouteSize(node.parent, size + 1)
}

function bfs(graph: Map<string, Node[]>, start:Node, end:Node) {
  const visited = new Set<string>();
  const root = { ...start, parent: null }
  const queue:LinkedNode[] = [root];

  while (queue.length) {
    const node = queue.shift()!; // mutates the queue

    if (node.key === end.key) {
      // console.log('Found ', getRouteSize(node))
      return getRouteSize(node)
    }

    for (const target of graph.get(node.key)!) {
      if (!visited.has(target.key)) {
        visited.add(target.key);
        const queueElement = { ...target, parent: node }
        queue.push(queueElement);
      }
    }
  }
  return Infinity
}

export default function solve() {
  const content = aoc.readInput('input.txt')

  // Transform to node objects
  const nodes = content
    .split('\n')
    .map((row, x) => row.split('')
      .map((char, y) => toNode(char, x, y)))

  // Get starting position and destination
  const start = getNodeOfChar(nodes, 'S')
  const end = getNodeOfChar(nodes, 'E')
  start.char = 'a'
  end.char = 'z'

  const adjacentList = new Map<string, Node[]>();
  const lowestPoints:Node[] = []
  for (const row of nodes) {
    for (const node of row) {
      if (node.char === 'a') {
        lowestPoints.push(node)
      }
      const allowedNeighbours = getNeighbours(nodes, node).filter(n => node.code + 1 >= n.code)
      adjacentList.set(node.key, allowedNeighbours)
    }
  }

  console.log('Part I', bfs(adjacentList, start, end))

  const lowestPointsDistances = lowestPoints.map(startingNode => bfs(adjacentList, startingNode, end))
  console.log('Part II', _.min(lowestPointsDistances))
}
