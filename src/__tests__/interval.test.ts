import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { interval } from '../../dist/index.js';

describe('interval', () => {
  it('runs the callback repeatedly until stopped', async () => {
    let count = 0;
    const handle = interval(() => {
      count += 1;
    }, 10);
    await new Promise((resolve) => setTimeout(resolve, 55));
    handle.stop();
    assert.ok(count >= 3, `expected at least 3 ticks, got ${count}`);
  });

  it('respects maxTicks and stops automatically', async () => {
    let count = 0;
    const handle = interval(
      () => {
        count += 1;
      },
      5,
      { maxTicks: 3 },
    );
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal(count, 3);
    assert.equal(handle.ticks, 3);
  });

  it('runs immediately when immediate=true', async () => {
    let count = 0;
    const handle = interval(
      () => {
        count += 1;
      },
      1000,
      { immediate: true },
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    handle.stop();
    assert.equal(count, 1);
  });

  it('routes errors to onError when provided', async () => {
    const errors: unknown[] = [];
    const handle = interval(
      () => {
        throw new Error('boom');
      },
      5,
      { maxTicks: 2, onError: (err) => errors.push(err) },
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    handle.stop();
    assert.equal(errors.length, 2);
  });

  it('throws on non-positive interval', () => {
    assert.throws(() => interval(() => {}, 0), /positive/);
    assert.throws(() => interval(() => {}, -10), /positive/);
  });
});
