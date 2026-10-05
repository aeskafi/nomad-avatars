import { reactive, computed } from 'vue';
import type { PlaygroundStoreOptions } from '@theme/types';

export function useRangeField(avatarStyleOptions: PlaygroundStoreOptions) {
  const rangeMode = reactive<Record<string, boolean>>({});

  function isRangeMode(key: string): boolean {
    if (rangeMode[key] !== undefined) return rangeMode[key];

    return Array.isArray(avatarStyleOptions[key]);
  }

  function toggleRangeMode(key: string, fallback: number) {
    const wasRange = isRangeMode(key);

    rangeMode[key] = !wasRange;

    if (wasRange) {
      const val = avatarStyleOptions[key];
      const single = Array.isArray(val)
        ? val[0]
        : typeof val === 'number'
          ? val
          : fallback;

      avatarStyleOptions[key] = single;
    } else {
      const val = avatarStyleOptions[key];
      const single = typeof val === 'number' ? val : fallback;

      avatarStyleOptions[key] = [single, single];
    }
  }

  function singleComputed(key: string, fallback: number | (() => number)) {
    const resolve = typeof fallback === 'function' ? fallback : () => fallback;

    return computed({
      get: () => {
        const val = avatarStyleOptions[key];

        return typeof val === 'number' ? val : resolve();
      },
      set: (val: number) => {
        avatarStyleOptions[key] = val;
      },
    });
  }

  function resetRangeField(key: string) {
    delete avatarStyleOptions[key];
    delete rangeMode[key];
  }

  function rangeComputed(
    key: string,
    fallback: number | readonly number[] | (() => number | readonly number[]),
  ) {
    const resolve = typeof fallback === 'function' ? fallback : () => fallback;

    return computed<[number, number]>({
      get: () => {
        const val = avatarStyleOptions[key];

        if (Array.isArray(val) && val.length === 2)
          return [val[0], val[1]] as [number, number];
        if (typeof val === 'number') return [val, val] as [number, number];

        const fb = resolve();

        if (Array.isArray(fb) && fb.length === 2)
          return [fb[0], fb[1]] as [number, number];

        const single = typeof fb === 'number' ? fb : 0;

        return [single, single] as [number, number];
      },
      set: (val: [number, number]) => {
        avatarStyleOptions[key] = [val[0], val[1]];
      },
    });
  }

  return {
    rangeMode,
    isRangeMode,
    toggleRangeMode,
    resetRangeField,
    singleComputed,
    rangeComputed,
  };
}
