/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-use-before-define */
import _ from 'lodash';
import graphlib, { Graph } from '@dagrejs/graphlib'
import * as aoc from '../utils/aoc.js';

export default function solve() {
  const content = aoc.readInput('example.txt');

  let valves = parseInput(content)
  var g = new Graph();

  const maxRate = Math.max(...valves.map(v => v.rate))
  valves = valves.map(v => ({ ...v, cost: v.rate + (maxRate - v.rate) * 2 as number }))

  console.log(valves)
  valves.forEach(v => {
    g.setNode(v.valve, v)
    v.leadsTo.forEach(c => {
      const targetValveRate = valves.find(valve => valve.valve === c)?.cost
      // const cost = targetValveRate - maxRate
      g.setEdge(v.valve, c, 1)
    })
  })

  function weight(e:string) {
    return g.edge(e);
  }

  const paths = graphlib.alg.dijkstra(g, 'AA', weight)
  console.log(paths)
  // console.log(valves)
}

function parseInput(input:string) {
  return input.split('\n')
    .map(s => {
      const [first, second] = s.split(';')
      const leadsTo = second.replace(' tunnels lead to valves ', '').replace(' tunnel leads to valve ', '').split(', ')
      const [valve, rate] = aoc.patternMatch(first, 'Valve $str has flow rate=$int')
      return {
        valve: valve as string,
        rate: rate as number,
        leadsTo: leadsTo as string[],
      }
    })
}
