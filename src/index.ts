import { autoDownload } from './utils/fileUtils.js';
import { leadingZeroDay } from './utils/stringutils.js';

// Start execution measurement
console.time('Script execution')
// Read day from arguments
const day = process.argv[2] || new Date().getDate();
console.log('\x1b[33m%s\x1b[0m', `\n 🎄 Day ${leadingZeroDay(day)}`); // cyan

// Auto-download the input for the selected day
await autoDownload(day);

// Import and execute the solving function for that day
(await import(`./day-${leadingZeroDay(day)}/solve.js`)).default();

console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
// Stop execution measurement
console.timeEnd('Script execution')
