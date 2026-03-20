import type { Timer, Lap, FormattedDuration } from './types.js';

/**
 * Formats a millisecond duration into a human-readable string.
 *
 * @param ms - Duration in milliseconds.
 * @returns A formatted string like "1h 2m 3s 45ms" or "0ms".
 */
export function formatDuration(ms: number): string {
  const parts = decompose(ms);
  const segments: string[] = [];

  if (parts.hours > 0) segments.push(`${parts.hours}h`);
  if (parts.minutes > 0) segments.push(`${parts.minutes}m`);
  if (parts.seconds > 0) segments.push(`${parts.seconds}s`);
  if (parts.milliseconds > 0 || segments.length === 0) {
    segments.push(`${parts.milliseconds}ms`);
  }

  return segments.join(' ');
}

/**
 * Decomposes milliseconds into hours, minutes, seconds, and remaining milliseconds.
 */
function decompose(ms: number): FormattedDuration {
  const totalMs = Math.max(0, Math.round(ms));
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1_000);
  const milliseconds = totalMs % 1_000;

  return { hours, minutes, seconds, milliseconds };
}

/**
 * Creates a high-resolution timer.
 *
 * @returns A `Timer` object with `elapsed`, `stop`, `reset`, `lap`, `laps`, and `format` methods.
 *
 * @example
 * ```ts
 * const t = timer();
 * // ... do work ...
 * console.log(t.format()); // "123ms"
 * t.lap();
 * // ... more work ...
 * t.lap();
 * console.log(t.laps());
 * const total = t.stop();
 * ```
 */
export function timer(): Timer {
  let startTime = performance.now();
  let stopTime: number | null = null;
  const lapRecords: Lap[] = [];
  let lastLapTime = startTime;

  function elapsed(): number {
    if (stopTime !== null) {
      return stopTime - startTime;
    }
    return performance.now() - startTime;
  }

  function stop(): number {
    if (stopTime === null) {
      stopTime = performance.now();
    }
    return stopTime - startTime;
  }

  function reset(): void {
    startTime = performance.now();
    stopTime = null;
    lapRecords.length = 0;
    lastLapTime = startTime;
  }

  function lap(): Lap {
    const now = stopTime !== null ? stopTime : performance.now();
    const split = now - lastLapTime;
    const totalElapsed = now - startTime;
    const record: Lap = {
      index: lapRecords.length + 1,
      split,
      elapsed: totalElapsed,
    };
    lapRecords.push(record);
    lastLapTime = now;
    return record;
  }

  function laps(): Lap[] {
    return [...lapRecords];
  }

  function format(): string {
    return formatDuration(elapsed());
  }

  return { elapsed, stop, reset, lap, laps, format };
}
