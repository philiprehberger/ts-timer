import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { measure, measureAsync } from '../dist/index.js';

describe('measure', () => {
  it('should return the result and duration', () => {
    const { result, duration } = measure(() => 42);
    assert.equal(result, 42);
    assert.ok(typeof duration === 'number');
    assert.ok(duration >= 0);
  });

  it('should measure a computation', () => {
    const { result, duration } = measure(() => {
      let sum = 0;
      for (let i = 0; i < 10_000; i++) sum += i;
      return sum;
    });
    assert.equal(result, 49_995_000);
    assert.ok(duration >= 0);
  });

  it('should propagate errors', () => {
    assert.throws(() => {
      measure(() => {
        throw new Error('test error');
      });
    }, /test error/);
  });
});

describe('measureAsync', () => {
  it('should return the result and duration', async () => {
    const { result, duration } = await measureAsync(async () => 'hello');
    assert.equal(result, 'hello');
    assert.ok(duration >= 0);
  });

  it('should measure an async operation', async () => {
    const { result, duration } = await measureAsync(
      () => new Promise<number>((resolve) => setTimeout(() => resolve(99), 10)),
    );
    assert.equal(result, 99);
    assert.ok(duration >= 5, 'should take at least a few ms');
  });

  it('should propagate async errors', async () => {
    await assert.rejects(
      () => measureAsync(async () => { throw new Error('async error'); }),
      /async error/,
    );
  });
});
