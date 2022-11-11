/**
 * Sleep function
 * @param ms Number of milliseconds
 * @returns Promise ending in {ms} milliseconds
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Random sleep
 * @param min Minimum amount
 * @param max Maximum amount
 * @returns A promise ending at a random time between min and max
 */
export function randomSleep(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const toWait = Math.floor(Math.random() * (max - min)) + min;
  return new Promise(resolve => setTimeout(resolve, toWait));
}
