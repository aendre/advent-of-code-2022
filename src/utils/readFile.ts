import * as fs from 'fs';

export function readInputFile(path: string) {
  return fs.readFileSync(`./src/${path}`, 'utf8');
}
