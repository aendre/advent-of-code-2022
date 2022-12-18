import axios from 'axios';
import * as fs from 'fs';
import path from 'path'
import { leadingZeroDay } from './stringutils.js';

const dayOfAoc = process.argv[2] || new Date().getDate();

export const aoc = {
  day: dayOfAoc,
  dday: leadingZeroDay(dayOfAoc),
  year: 2022,
}

export function startDay() {
  console.log('\x1b[33m%s\x1b[0m', `\n 🎄 Day ${aoc.dday}`); // cyan
}

export function endDay() {
  console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
  console.timeEnd('AoC execution')
  console.log('\n')
}

export function readInput(filename: string) {
  console.log('\x1b[33m%s\x1b[0m', ` 🚀 ${filename}`);
  console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
  const filePath = `src/day-${aoc.dday}/${filename}`;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.time('AoC execution')
  return fileContent
}

export function input() {
  return readInput('input.txt')
}
export function inputE() {
  return readInput('example.txt')
}

export async function downloadInput(year: string, day: string | number, sessionCookie: string) {
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    withCredentials: true,
    headers: {
      cookie: `session=${sessionCookie}`,
    },
  });

  // Strip last new line character
  return response.data.replace(/\n$/, '');
}

export async function autoDownload(day: string | number) {
  const now = new Date();
  const dayday = leadingZeroDay(day);
  const year = now.getFullYear().toString();

  if (Number(day) > now.getDate()) {
    console.log('\x1b[33m%s\x1b[0m', ' 🏗️  No input downloaded from the future');
    return
  }

  const sessionCookie = fs.readFileSync('.session.cfg', 'utf-8');
  const filePath = `src/day-${dayday}/input.txt`;

  if (!fs.existsSync(filePath)) {
    const content = await downloadInput(year, day, sessionCookie)
    fs.writeFileSync(filePath, content, {
      encoding: 'utf8',
    })
    console.log('\x1b[33m%s\x1b[0m', ` 🏗️  New input downloaded: ${filePath}`);
  }
}
