import {
  autoDownload, aoc, endDay, startDay,
} from './utils/aoc.js';

startDay()
await autoDownload(aoc.day);
(await import(`./day-${aoc.dday}/solve.js`)).default();
endDay()
