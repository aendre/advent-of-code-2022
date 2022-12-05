import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import Sugar from 'sugar'
import { fileURLToPath } from 'url';
import { readFromFolder } from '../utils/fileUtils.js';

export default function solve() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const content = readFromFolder(dirname, 'example.txt')

  const input = content.split('\n');
  console.log(input)
}
