export interface IntervalHandle {
  readonly ticks: number;
  stop(): void;
}

export interface IntervalOptions {
  /** Run the callback immediately on start in addition to scheduling subsequent ticks. */
  immediate?: boolean;
  /** Maximum number of ticks before auto-stopping. Default is unlimited. */
  maxTicks?: number;
  /** Called when an iteration of `fn` throws or rejects. */
  onError?: (error: unknown) => void;
}

/**
 * Drift-corrected repeating interval. Each tick is scheduled relative to the
 * intended next time rather than the previous run, so slow callbacks do not
 * cause cumulative drift. Awaits async callbacks before scheduling the next tick.
 */
export function interval(
  fn: () => void | Promise<void>,
  ms: number,
  options: IntervalOptions = {},
): IntervalHandle {
  if (!Number.isFinite(ms) || ms <= 0) {
    throw new RangeError('interval(): ms must be a positive finite number');
  }

  const { immediate = false, maxTicks, onError } = options;

  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let nextTime = Date.now();
  const handle = {
    ticks: 0,
    stop(): void {
      stopped = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };

  async function run(): Promise<void> {
    if (stopped) return;
    handle.ticks += 1;
    try {
      await fn();
    } catch (error) {
      if (onError) onError(error);
      else throw error;
    }
    if (stopped) return;
    if (maxTicks !== undefined && handle.ticks >= maxTicks) {
      handle.stop();
      return;
    }
    schedule();
  }

  function schedule(): void {
    nextTime += ms;
    const delay = Math.max(0, nextTime - Date.now());
    timeoutId = setTimeout(() => {
      timeoutId = null;
      void run();
    }, delay);
  }

  if (immediate) {
    void run();
  } else {
    schedule();
  }

  return handle;
}
