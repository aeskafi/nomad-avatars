<script setup lang="ts">
// We deliberately do NOT use PrimeVue's ColorPicker here: it cannot host the
// iso-contrast overlay polyline that maps WCAG pick boundaries onto the
// saturation/value plane.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Color } from '@dicebear/core';
import { clamp, hsvToHex } from '@theme/utils/colorSpaces';
import type { Hsv } from '@theme/utils/colorSpaces';

const props = defineProps<{
  hsv: Hsv;
  contrastA: string;
  contrastB: string;
}>();

const emit = defineEmits<{
  'update:hsv': [hsv: Hsv];
}>();

const surface = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const surfaceSize = ref({ width: 0, height: 0 });

function setFromPointer(event: PointerEvent) {
  if (!surface.value) return;
  const rect = surface.value.getBoundingClientRect();
  const s = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
  const v = clamp((1 - (event.clientY - rect.top) / rect.height) * 100, 0, 100);
  if (s === props.hsv.s && v === props.hsv.v) return;
  emit('update:hsv', { h: props.hsv.h, s, v });
}

function onPointerDown(event: PointerEvent) {
  isDragging.value = true;
  (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  setFromPointer(event);
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return;
  setFromPointer(event);
}

function onPointerUp(event: PointerEvent) {
  isDragging.value = false;
  (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
}

function onKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? 5 : 1;
  let { s, v } = props.hsv;
  let handled = true;

  switch (event.key) {
    case 'ArrowLeft':
      s = clamp(s - step, 0, 100);
      break;
    case 'ArrowRight':
      s = clamp(s + step, 0, 100);
      break;
    case 'ArrowUp':
      v = clamp(v + step, 0, 100);
      break;
    case 'ArrowDown':
      v = clamp(v - step, 0, 100);
      break;
    default:
      handled = false;
  }

  if (handled) {
    event.preventDefault();
    if (s === props.hsv.s && v === props.hsv.v) return;
    emit('update:hsv', { h: props.hsv.h, s, v });
  }
}

// Tracks the surface dimensions so the SVG overlay scales correctly.
function measureSurface() {
  if (!surface.value) return;
  const rect = surface.value.getBoundingClientRect();
  surfaceSize.value = { width: rect.width, height: rect.height };
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  measureSurface();
  if (typeof ResizeObserver !== 'undefined' && surface.value) {
    resizeObserver = new ResizeObserver(measureSurface);
    resizeObserver.observe(surface.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const cursorStyle = computed(() => ({
  left: `${props.hsv.s}%`,
  top: `${100 - props.hsv.v}%`,
}));

const ariaValueText = computed(
  () =>
    `${hsvToHex(props.hsv)}, saturation ${Math.round(props.hsv.s)} percent, value ${Math.round(props.hsv.v)} percent`,
);

// Layered gradients (white→hue overlaid with transparent→black) compose to
// the canonical HSV saturation/value square at the current hue.
const hueOnlyBackground = computed(() => {
  const hueColor = hsvToHex({ h: props.hsv.h, s: 100, v: 100 });
  return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`;
});

// Iso-contrast curve: the set of HSV (s, v) points (at the current hue)
// where contrast against A equals contrast against B. The equal-contrast
// luminance is L* = sqrt((L_a + 0.05) * (L_b + 0.05)) - 0.05. We binary
// search V along each S step so the curve plots exactly the points where
// Color.sortByContrast would swap its pick. Tracks only hue (not s/v) so
// dragging the crosshair doesn't retrigger ~1.9k luminance calls.
const isoContrastPath = computed<string | null>(() => {
  if (surfaceSize.value.width === 0) return null;

  const hue = props.hsv.h;
  const la = Color.luminance(props.contrastA);
  const lb = Color.luminance(props.contrastB);
  const target = Math.sqrt((la + 0.05) * (lb + 0.05)) - 0.05;

  if (target <= 0 || target >= 1) return null;

  const steps = 80;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * 100;
    let lo = 0;
    let hi = 100;

    for (let iter = 0; iter < 24; iter++) {
      const mid = (lo + hi) / 2;
      const lum = Color.luminance(hsvToHex({ h: hue, s, v: mid }));
      if (lum < target) lo = mid;
      else hi = mid;
    }

    const v = (lo + hi) / 2;
    if (v <= 0 || v >= 100) continue;

    points.push(`${s},${100 - v}`);
  }

  if (points.length < 2) return null;
  return `M ${points.join(' L ')}`;
});
</script>

<template>
  <div class="contrast-canvas">
    <div
      ref="surface"
      class="contrast-canvas-surface"
      :style="{ background: hueOnlyBackground }"
      role="slider"
      aria-label="Color picker: drag or use arrow keys"
      :aria-valuetext="ariaValueText"
      tabindex="0"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <svg
        v-if="isoContrastPath"
        class="contrast-canvas-iso"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          :d="isoContrastPath"
          class="contrast-canvas-iso-outline"
          vector-effect="non-scaling-stroke"
        />
        <path
          :d="isoContrastPath"
          class="contrast-canvas-iso-stroke"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <div
        class="contrast-canvas-cursor"
        :style="cursorStyle"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contrast-canvas {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &-surface {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--vp-radius-md);
    cursor: crosshair;
    touch-action: none;
    overflow: hidden;
    border: 1px solid var(--vp-c-border);
    user-select: none;

    &:focus-visible {
      outline: 3px solid var(--p-primary-color);
      outline-offset: 2px;
    }
  }

  &-iso {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &-outline {
      fill: none;
      stroke: rgba(0, 0, 0, 0.6);
      stroke-width: 4;
      stroke-linejoin: round;
      stroke-linecap: round;
    }

    &-stroke {
      fill: none;
      stroke: rgba(255, 255, 255, 0.95);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-dasharray: 4 3;
    }
  }

  &-cursor {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.4),
      0 2px 6px rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
