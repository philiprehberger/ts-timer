import type { BenchmarkOptions, BenchmarkResult } from './types.js';

/**
 * Computes a percentile value from a **sorted** array of numbers.
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Benchmarks a synchronous function over many iterations.
 *
 * @param fn - The function to benchmark.
 * @param options - Configuration for iterations and warmup.
 * @returns Statistics including mean, median, p95, p99, min, max, and ops/sec.
 *
 * @example
 * ```ts
 * const stats = benchmark(() => JSON.parse('{"a":1}'));
 * console.log(`Mean: ${stats.mean.toFixed(4)}ms, Ops: ${stats.ops.toFixed(0)}/sec`);
 * ```
 */
export function benchmark(
  fn: () => void,
  options: BenchmarkOptions = {},
): BenchmarkResult {
  const { iterations = 1000, warmup = 100 } = options;

  // Warmup phase
  for (let i = 0; i < warmup; i++) {
    fn();
  }

  // Measurement phase
  const durations: number[] = new Array(iterations);
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    durations[i] = performance.now() - start;
  }

  durations.sort((a, b) => a - b);

  const sum = durations.reduce((acc, d) => acc + d, 0);
  const mean = sum / iterations;
  const median = percentile(durations, 50);
  const p95 = percentile(durations, 95);
  const p99 = percentile(durations, 99);
  const min = durations[0];
  const max = durations[durations.length - 1];
  const ops = mean > 0 ? 1000 / mean : Infinity;

  return { mean, median, p95, p99, min, max, ops, iterations };
}
