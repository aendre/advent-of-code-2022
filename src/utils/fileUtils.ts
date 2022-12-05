import axios from 'axios';
import * as fs from 'fs';
import path from 'path'
import { leadingZeroDay } from './stringutils.js';

export function readInputFile(filepath: string) {
  return fs.readFileSync(`./src/${filepath}`, 'utf8');
}

export function readFromFolder(folder: string, filename: string) {
  console.log('\x1b[33m%s\x1b[0m', ` 🚀 ${filename}`);
  console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
  const filepath = path.join(folder, filename)
  return fs.readFileSync(filepath, 'utf8');
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

  const sessionCookie = fs.readFileSync('.session.cfg', 'utf-8');
  const filePath = `src/day-${dayday}/input.txt`;

  if (!fs.existsSync(filePath)) {
    const content = await downloadInput(year, day, sessionCookie)
    fs.writeFileSync(filePath, content, {
      encoding: 'utf8',
    })
    console.log('\x1b[33m%s\x1b[0m', ` 🏗️  New input downloaded: ${filePath}`); // cyan
  }
}
