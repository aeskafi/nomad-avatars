<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@lucide/vue';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import Popover from 'primevue/popover';
import { stripHash } from '@theme/utils/avatar/colors';

defineProps<{
  presetColors: string[];
  colors: string[];
}>();

const emit = defineEmits<{
  add: [hex: string];
}>();

const popover = ref();
const nativePickerColor = ref('#b6e3f4');
const pickerOpacity = ref(100);

function pickerHexWithAlpha(): string {
  const hex = stripHash(nativePickerColor.value);

  if (pickerOpacity.value >= 100) return hex;

  const alpha = Math.round((pickerOpacity.value / 100) * 255)
    .toString(16)
    .padStart(2, '0');

  return `${hex}${alpha}`;
}

function toggle(event: Event) {
  popover.value.toggle(event);
}

function addFromPicker() {
  emit('add', pickerHexWithAlpha());
  popover.value.hide();
}

function addPreset(hex: string) {
  emit('add', hex);
  popover.value.hide();
}
</script>

<template>
  <button class="pg-color-picker-trigger" @click="toggle">
    <Plus :size="20" />
  </button>

  <Popover ref="popover">
    <div class="pg-picker">
      <div
        class="pg-picker-presets"
        v-if="presetColors.some((p) => !colors.includes(p))"
      >
        <button
          v-for="preset in presetColors"
          :key="preset"
          v-show="!colors.includes(preset)"
          class="pg-picker-preset"
          :style="{ backgroundColor: `#${preset}` }"
          @click="addPreset(preset)"
        />
      </div>
      <div class="pg-picker-custom">
        <input
          type="color"
          v-model="nativePickerColor"
          class="pg-picker-native"
        />
        <div class="pg-picker-opacity">
          <span class="pg-picker-opacity-label">Opacity</span>
          <Slider
            v-model="pickerOpacity"
            :min="0"
            :max="100"
            :step="1"
            class="pg-picker-opacity-slider"
          />
          <span>{{ pickerOpacity }}%</span>
        </div>
      </div>
      <Button
        :label="`Add #${pickerHexWithAlpha()}`"
        severity="secondary"
        variant="outlined"
        size="small"
        @click="addFromPicker"
      />
    </div>
  </Popover>
</template>

<style scoped lang="scss">
.pg-color-picker-trigger {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 2px dashed var(--pg-border);
  border-radius: var(--vp-radius-xs);
  color: var(--ui-c-text-subtle);
  cursor: pointer;

  &:hover {
    border-color: var(--p-primary-color);
    color: var(--p-primary-color);
  }
}

.pg-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.pg-picker-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.pg-picker-preset {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--vp-radius-xs);
  cursor: pointer;
  transition: transform var(--duration-fast) ease;

  &:hover {
    transform: scale(1.15);
  }
}

.pg-picker-custom {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--pg-border);
}

.pg-picker-native {
  width: 36px;
  height: 36px;
  padding: 2px;
  border: 1px solid var(--pg-border);
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

.pg-picker-opacity {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  &-label {
    font-size: 12px;
    color: var(--ui-c-text-subtle);
    white-space: nowrap;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: var(--ui-c-text-muted);
    min-width: 36px;
    text-align: right;
  }
}

.pg-picker-opacity-slider {
  flex: 1;
  min-width: 60px;
}
</style>
