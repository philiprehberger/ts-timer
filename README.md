# @philiprehberger/ts-timer

[![CI](https://github.com/philiprehberger/ts-timer/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-timer/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/ts-timer.svg)](https://www.npmjs.com/package/@philiprehberger/ts-timer)
[![License](https://img.shields.io/github/license/philiprehberger/ts-timer)](LICENSE)

Precise timing utilities — measure, benchmark, countdown.

## Requirements

- Node.js >= 18

## Installation

```bash
npm install @philiprehberger/ts-timer
```

## Usage

### Timer

```ts
import { timer } from '@philiprehberger/ts-timer';

const t = timer();

// Do some work...
t.lap();
// Do more work...
t.lap();

console.log(t.format()); // "245ms"
console.log(t.laps());   // [{ index: 1, split: 120, elapsed: 120 }, ...]

const total = t.stop();
```

### Measure

```ts
import { measure, measureAsync } from '@philiprehberger/ts-timer';

const { result, duration } = measure(() => heavyComputation());
console.log(`Result: ${result}, took ${duration}ms`);

const { result: data, duration: ms } = await measureAsync(() => fetch('/api'));
console.log(`Fetched in ${ms}ms`);
```

### Benchmark

```ts
import { benchmark } from '@philiprehberger/ts-timer';

const stats = benchmark(() => JSON.parse('{"a":1}'), {
  iterations: 5000,
  warmup: 500,
});

console.log(`Mean: ${stats.mean.toFixed(4)}ms`);
console.log(`Median: ${stats.median.toFixed(4)}ms`);
console.log(`P95: ${stats.p95.toFixed(4)}ms`);
console.log(`P99: ${stats.p99.toFixed(4)}ms`);
console.log(`Min: ${stats.min.toFixed(4)}ms`);
console.log(`Max: ${stats.max.toFixed(4)}ms`);
console.log(`Ops/sec: ${stats.ops.toFixed(0)}`);
```

### Format Duration

```ts
import { formatDuration } from '@philiprehberger/ts-timer';

formatDuration(0);         // "0ms"
formatDuration(1500);      // "1s 500ms"
formatDuration(3_661_500); // "1h 1m 1s 500ms"
```

## API

### `timer(): Timer`

Creates a high-resolution timer.

- `.elapsed(): number` — Current elapsed time in milliseconds.
- `.stop(): number` — Stops the timer; returns elapsed time.
- `.reset(): void` — Resets and restarts the timer.
- `.lap(): Lap` — Records a lap; returns `{ index, split, elapsed }`.
- `.laps(): Lap[]` — Returns all recorded laps.
- `.format(): string` — Formats the elapsed time as a human-readable string.

### `measure<T>(fn: () => T): MeasureResult<T>`

Measures execution time of a synchronous function. Returns `{ result, duration }`.

### `measureAsync<T>(fn: () => Promise<T>): Promise<MeasureResult<T>>`

Measures execution time of an asynchronous function. Returns `{ result, duration }`.

### `benchmark(fn: () => void, options?: BenchmarkOptions): BenchmarkResult`

Benchmarks a function over many iterations.

**Options:**
- `iterations` — Number of measured iterations (default: `1000`).
- `warmup` — Number of warmup iterations (default: `100`).

**Result:**
- `mean` — Arithmetic mean in ms.
- `median` — Median in ms.
- `p95` — 95th percentile in ms.
- `p99` — 99th percentile in ms.
- `min` — Minimum duration in ms.
- `max` — Maximum duration in ms.
- `ops` — Operations per second.
- `iterations` — Number of iterations run.

### `formatDuration(ms: number): string`

Formats a millisecond value into a human-readable string (e.g. `"1h 2m 3s 45ms"`).

## Development

```bash
npm install
npm run build
npm test
npm run typecheck
```

## License

[MIT](./LICENSE)
