export function leadingZeroDay(day: string | number) {
  return (`0${day}`).slice(-2); // Day with leadin zeroes
}
