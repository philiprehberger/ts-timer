import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { timer, formatDuration } from '../dist/index.js';

describe('timer', () => {
  it('should return elapsed time', () => {
    const t = timer();
    const elapsed = t.elapsed();
    assert.ok(elapsed >= 0, 'elapsed should be >= 0');
  });

  it('should stop and return final elapsed time', () => {
    const t = timer();
    const stopped = t.stop();
    assert.ok(stopped >= 0);
    // Calling stop again returns the same value
    const stoppedAgain = t.stop();
    assert.equal(stopped, stoppedAgain);
  });

  it('should freeze elapsed after stop', () => {
    const t = timer();
    const stopped = t.stop();
    const elapsed = t.elapsed();
    assert.equal(stopped, elapsed);
  });

  it('should reset the timer', () => {
    const t = timer();
    t.stop();
    t.reset();
    const elapsed = t.elapsed();
    assert.ok(elapsed >= 0);
    assert.ok(elapsed < 50, 'elapsed after reset should be very small');
  });

  it('should record laps', () => {
    const t = timer();
    const lap1 = t.lap();
    assert.equal(lap1.index, 1);
    assert.ok(lap1.split >= 0);
    assert.ok(lap1.elapsed >= 0);

    const lap2 = t.lap();
    assert.equal(lap2.index, 2);
    assert.ok(lap2.elapsed >= lap1.elapsed);
  });

  it('should return all laps', () => {
    const t = timer();
    t.lap();
    t.lap();
    t.lap();
    const allLaps = t.laps();
    assert.equal(allLaps.length, 3);
    assert.equal(allLaps[0].index, 1);
    assert.equal(allLaps[2].index, 3);
  });

  it('should return a defensive copy of laps', () => {
    const t = timer();
    t.lap();
    const laps1 = t.laps();
    t.lap();
    const laps2 = t.laps();
    assert.equal(laps1.length, 1);
    assert.equal(laps2.length, 2);
  });

  it('should clear laps on reset', () => {
    const t = timer();
    t.lap();
    t.lap();
    t.reset();
    assert.equal(t.laps().length, 0);
  });

  it('should format elapsed time', () => {
    const t = timer();
    const formatted = t.format();
    assert.ok(typeof formatted === 'string');
    assert.ok(formatted.includes('ms'));
  });
});

describe('formatDuration', () => {
  it('should format zero', () => {
    assert.equal(formatDuration(0), '0ms');
  });

  it('should format milliseconds only', () => {
    assert.equal(formatDuration(500), '500ms');
  });

  it('should format seconds and milliseconds', () => {
    assert.equal(formatDuration(1500), '1s 500ms');
  });

  it('should format minutes', () => {
    assert.equal(formatDuration(61_000), '1m 1s');
  });

  it('should format hours', () => {
    assert.equal(formatDuration(3_661_500), '1h 1m 1s 500ms');
  });

  it('should handle exact seconds', () => {
    assert.equal(formatDuration(2000), '2s');
  });

  it('should handle exact minutes', () => {
    assert.equal(formatDuration(120_000), '2m');
  });

  it('should handle negative values as zero', () => {
    assert.equal(formatDuration(-100), '0ms');
  });
});
