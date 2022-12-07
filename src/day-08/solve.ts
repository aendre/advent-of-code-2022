import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import math from '../utils/mathUtils.js'
import { readFromFolder } from '../utils/fileUtils.js';
import { patternMatch } from '../utils/stringutils.js';

export default function solve() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const content = readFromFolder(dirname, 'example.txt')

  const result = content.split('\n');

  console.log('PART I')
  console.log('PART II')
}
