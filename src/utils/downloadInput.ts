import axios from 'axios';
import * as fs from 'fs';

export async function downloadInput(year: string, day: string, sessionCookie: string) {
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    withCredentials: true,
    headers: {
      cookie: `session=${sessionCookie}`,
    },
  });

  // Strip last new line character
  return response.data.replace(/\n$/, '');
}

export async function autoDownload() {
  const now = new Date();
  const day = now.getDate().toString();
  const dayday = (`0${day}`).slice(-2); // Day with leadin zeroes
  const year = now.getFullYear().toString();

  const sessionCookie = fs.readFileSync('.session.cfg', 'utf-8');
  const filePath = `src/day-${dayday}/input.txt`;

  if (!fs.existsSync(filePath)) {
    const content = await downloadInput(year, day, sessionCookie)
    fs.writeFileSync(filePath, content, {
      encoding: 'utf8',
    })
    console.log('-----------------------------------------')
    console.log('! New download: ', filePath)
    console.log('-----------------------------------------')
  } else {
    console.log('-----------------------------------------')
    console.log('| Cached: ', filePath)
    console.log('-----------------------------------------')
  }
}
