import { autoDownload } from './utils/fileUtils.js';
import { leadingZeroDay } from './utils/stringutils.js';

// Read day from arguments
const day = process.argv[2] || new Date().getDate();

console.log('\x1b[33m%s\x1b[0m', `\n 🎄 Day ${leadingZeroDay(day)}`); // cyan

// Auto-download the input for the selected day
await autoDownload(day);

// Import the solving function for that day
const solve = await import(`./day-${leadingZeroDay(day)}/solve.js`);

// Execute the default export
solve.default()
console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
