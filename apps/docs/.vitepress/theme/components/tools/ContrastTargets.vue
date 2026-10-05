<script setup lang="ts">
import { computed } from 'vue';
import { Sparkles } from '@lucide/vue';
import { Color } from '@dicebear/core';
import { UiCard } from '../ui';

const props = defineProps<{
  pickedHex: string;
  contrastA: string;
  contrastB: string;
}>();

const emit = defineEmits<{
  'update:contrastA': [hex: string];
  'update:contrastB': [hex: string];
}>();

const pickedLuminance = computed(() => Color.luminance(props.pickedHex));

const pickedId = computed<'a' | 'b'>(() => {
  const sorted = Color.sortByContrast(
    [props.contrastA, props.contrastB],
    props.pickedHex,
  );
  return sorted[0] === props.contrastA ? 'a' : 'b';
});

const targets = computed(() => [
  { id: 'a' as const, label: 'Contrast color 1', value: props.contrastA },
  { id: 'b' as const, label: 'Contrast color 2', value: props.contrastB },
]);

function emitUpdate(id: 'a' | 'b', value: string) {
  if (id === 'a') emit('update:contrastA', value);
  else emit('update:contrastB', value);
}

function ratioFor(hex: string): string {
  const l = Color.luminance(hex);
  const lp = pickedLuminance.value;
  const ratio = (Math.max(l, lp) + 0.05) / (Math.min(l, lp) + 0.05);
  return `${ratio.toFixed(2)}:1`;
}
</script>

<template>
  <div class="contrast-targets">
    <UiCard
      v-for="target in targets"
      :key="target.id"
      padding="sm"
      class="contrast-target"
      :class="{ 'contrast-target-picked': pickedId === target.id }"
    >
      <header class="contrast-target-header">
        <h3 class="contrast-target-title">{{ target.label }}</h3>
        <span
          class="contrast-target-pick-badge"
          :class="{
            'contrast-target-pick-badge-hidden': pickedId !== target.id,
          }"
          :aria-hidden="pickedId !== target.id"
        >
          <Sparkles :size="12" />
          DiceBear picks this
        </span>
      </header>

      <div class="contrast-target-input-row">
        <input
          type="color"
          :value="target.value"
          class="contrast-target-color-input"
          @input="
            emitUpdate(target.id, ($event.target as HTMLInputElement).value)
          "
        />
        <div class="contrast-target-ratio">
          <span class="contrast-target-ratio-value">{{
            ratioFor(target.value)
          }}</span>
          <span class="contrast-target-ratio-label">Contrast ratio</span>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<style lang="scss" scoped>
.contrast-targets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.contrast-target {
  :deep(.ui-card-body) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  // Compound selector to beat UiCard's `.ui-card` rule in cascade
  // (both selectors otherwise have identical specificity).
  &.contrast-target-picked {
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }

  &-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin: 0;
  }

  &-pick-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    background: var(--vp-c-brand-1);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    border-radius: var(--vp-radius-lg);
    letter-spacing: 0.3px;
    transition: opacity var(--duration-fast) var(--ease-smooth);

    &-hidden {
      visibility: hidden;
      opacity: 0;
    }
  }

  &-input-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &-color-input {
    width: 42px;
    height: 42px;
    padding: 2px;
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    background: var(--vp-c-bg);
    cursor: pointer;
    flex-shrink: 0;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }

    &::-moz-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }

  &-ratio {
    display: flex;
    align-items: baseline;
    gap: 10px;

    &-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--vp-c-text-1);
      font-variant-numeric: tabular-nums;
    }

    &-label {
      font-size: 11px;
      color: var(--ui-c-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
}
</style>
