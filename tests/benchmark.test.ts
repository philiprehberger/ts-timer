import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { benchmark } from '../dist/index.js';

describe('benchmark', () => {
  it('should return all expected statistics', () => {
    const stats = benchmark(() => {
      let sum = 0;
      for (let i = 0; i < 100; i++) sum += i;
    });

    assert.ok(typeof stats.mean === 'number');
    assert.ok(typeof stats.median === 'number');
    assert.ok(typeof stats.p95 === 'number');
    assert.ok(typeof stats.p99 === 'number');
    assert.ok(typeof stats.min === 'number');
    assert.ok(typeof stats.max === 'number');
    assert.ok(typeof stats.ops === 'number');
    assert.ok(typeof stats.iterations === 'number');
  });

  it('should use default iterations and warmup', () => {
    const stats = benchmark(() => {});
    assert.equal(stats.iterations, 1000);
  });

  it('should respect custom iterations', () => {
    const stats = benchmark(() => {}, { iterations: 50, warmup: 5 });
    assert.equal(stats.iterations, 50);
  });

  it('should have min <= median <= max', () => {
    const stats = benchmark(() => {
      Math.random();
    }, { iterations: 200, warmup: 10 });

    assert.ok(stats.min <= stats.median, `min (${stats.min}) should be <= median (${stats.median})`);
    assert.ok(stats.median <= stats.max, `median (${stats.median}) should be <= max (${stats.max})`);
  });

  it('should have p95 <= p99', () => {
    const stats = benchmark(() => {
      Math.random();
    }, { iterations: 200, warmup: 10 });

    assert.ok(stats.p95 <= stats.p99, `p95 (${stats.p95}) should be <= p99 (${stats.p99})`);
  });

  it('should have positive ops/sec', () => {
    const stats = benchmark(() => {
      JSON.parse('{"a":1}');
    }, { iterations: 100, warmup: 10 });

    assert.ok(stats.ops > 0, 'ops should be positive');
  });

  it('should have mean >= min and mean <= max', () => {
    const stats = benchmark(() => {
      Math.random();
    }, { iterations: 100, warmup: 10 });

    assert.ok(stats.mean >= stats.min, `mean (${stats.mean}) should be >= min (${stats.min})`);
    assert.ok(stats.mean <= stats.max, `mean (${stats.mean}) should be <= max (${stats.max})`);
  });
});
