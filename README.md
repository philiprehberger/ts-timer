# @philiprehberger/timer

[![CI](https://github.com/philiprehberger/ts-timer/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-timer/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/timer.svg)](https://www.npmjs.com/package/@philiprehberger/timer)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-timer)](https://github.com/philiprehberger/ts-timer/commits/main)

Precise timing utilities — measure, benchmark, countdown

## Installation

```bash
npm install @philiprehberger/timer
```

## Usage

```ts
import { timer, measure, benchmark, interval, formatDuration } from '@philiprehberger/timer';

const t = timer();
doSomeWork();
console.log(t.format()); // "245ms"
```

### Timer

```ts
import { timer } from '@philiprehberger/timer';

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
import { measure, measureAsync } from '@philiprehberger/timer';

const { result, duration } = measure(() => heavyComputation());
console.log(`Result: ${result}, took ${duration}ms`);

const { result: data, duration: ms } = await measureAsync(() => fetch('/api'));
console.log(`Fetched in ${ms}ms`);
```

### Benchmark

```ts
import { benchmark } from '@philiprehberger/timer';

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
import { formatDuration } from '@philiprehberger/timer';

formatDuration(0);         // "0ms"
formatDuration(1500);      // "1s 500ms"
formatDuration(3_661_500); // "1h 1m 1s 500ms"
```

### Drift-Corrected Interval

```ts
import { interval } from '@philiprehberger/timer';

const handle = interval(() => poll(), 1000, { immediate: true });

// later
handle.stop();
```

Each tick is scheduled relative to the intended next time, so a slow callback
does not cause cumulative drift. Async callbacks are awaited before the next
tick is scheduled.

## API

| Function | Description |
|----------|-------------|
| `timer()` | Create a high-resolution timer with `elapsed`/`stop`/`reset`/`lap`/`laps`/`format` |
| `measure(fn)` | Measure a synchronous function — returns `{ result, duration }` |
| `measureAsync(fn)` | Measure an async function — returns a promise of `{ result, duration }` |
| `benchmark(fn, options?)` | Benchmark a function over many iterations |
| `interval(fn, ms, options?)` | Drift-corrected repeating interval; returns a stoppable handle |
| `formatDuration(ms)` | Format milliseconds as `"1h 2m 3s 45ms"` |

### `IntervalOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `immediate` | `boolean` | `false` | Run the callback once on start as well as on the schedule |
| `maxTicks` | `number` | `undefined` | Stop automatically after N ticks |
| `onError` | `(err: unknown) => void` | `undefined` | Receive errors thrown by the callback (otherwise rethrown) |

### `BenchmarkResult`

| Property | Description |
|----------|-------------|
| `mean`, `median`, `p95`, `p99`, `min`, `max` | Latency stats in ms |
| `ops` | Operations per second based on mean |
| `iterations` | Number of measured iterations |

## Development

```bash
npm install
npm run build
npm test
npm run typecheck
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-timer)

🐛 [Report issues](https://github.com/philiprehberger/ts-timer/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-timer/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
