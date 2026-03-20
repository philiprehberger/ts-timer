import type { MeasureResult } from './types.js';

/**
 * Measures the execution time of a synchronous function.
 *
 * @param fn - The function to measure.
 * @returns An object containing the function's return value and the duration in milliseconds.
 *
 * @example
 * ```ts
 * const { result, duration } = measure(() => heavyComputation());
 * console.log(`Took ${duration}ms`);
 * ```
 */
export function measure<T>(fn: () => T): MeasureResult<T> {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Measures the execution time of an asynchronous function.
 *
 * @param fn - The async function to measure.
 * @returns A promise resolving to an object with the return value and duration in milliseconds.
 *
 * @example
 * ```ts
 * const { result, duration } = await measureAsync(() => fetch('/api/data'));
 * console.log(`Took ${duration}ms`);
 * ```
 */
export async function measureAsync<T>(fn: () => Promise<T>): Promise<MeasureResult<T>> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}
