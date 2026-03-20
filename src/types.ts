/**
 * Represents a duration broken down into units.
 */
export interface FormattedDuration {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/**
 * A lap record captured by the timer.
 */
export interface Lap {
  /** Lap index (1-based). */
  index: number;
  /** Time since the previous lap (or start), in milliseconds. */
  split: number;
  /** Total elapsed time at the moment the lap was recorded, in milliseconds. */
  elapsed: number;
}

/**
 * The object returned by `timer()`.
 */
export interface Timer {
  /** Returns the elapsed time in milliseconds. */
  elapsed(): number;
  /** Stops the timer and returns the elapsed time in milliseconds. */
  stop(): number;
  /** Resets the timer to zero and starts it again. */
  reset(): void;
  /** Records a lap and returns the lap data. */
  lap(): Lap;
  /** Returns all recorded laps. */
  laps(): Lap[];
  /** Formats the current elapsed time into a human-readable string. */
  format(): string;
}

/**
 * Options for the `benchmark` function.
 */
export interface BenchmarkOptions {
  /** Number of measured iterations (default: 1000). */
  iterations?: number;
  /** Number of warmup iterations before measurement (default: 100). */
  warmup?: number;
}

/**
 * Result of a benchmark run.
 */
export interface BenchmarkResult {
  /** Arithmetic mean in milliseconds. */
  mean: number;
  /** Median in milliseconds. */
  median: number;
  /** 95th percentile in milliseconds. */
  p95: number;
  /** 99th percentile in milliseconds. */
  p99: number;
  /** Minimum duration in milliseconds. */
  min: number;
  /** Maximum duration in milliseconds. */
  max: number;
  /** Operations per second based on mean. */
  ops: number;
  /** Total number of measured iterations. */
  iterations: number;
}

/**
 * Result of `measure` or `measureAsync`.
 */
export interface MeasureResult<T> {
  /** The return value of the measured function. */
  result: T;
  /** Duration in milliseconds. */
  duration: number;
}
