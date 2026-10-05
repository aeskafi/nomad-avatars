<script setup lang="ts">
import { computed } from 'vue';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import { ArrowLeftRight } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    optionKey: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
    defaultSingle: number;
  }>(),
  {
    unit: '',
  },
);

const store = useStore();
const {
  isRangeMode,
  toggleRangeMode,
  resetRangeField,
  singleComputed,
  rangeComputed,
} = useRangeField(store.avatarStyleOptions);

const singleVal = singleComputed(props.optionKey, () => props.defaultSingle);
const rangeVal = rangeComputed(props.optionKey, () => props.defaultSingle);

const displayRange = computed<[number, number]>(() => {
  const [a, b] = rangeVal.value;

  return [Math.min(a, b), Math.max(a, b)];
});
</script>

<template>
  <div class="pg-field">
    <div class="pg-field-label">
      <span>{{ label }}</span>
      <Button
        size="small"
        :severity="isRangeMode(optionKey) ? 'primary' : 'secondary'"
        variant="outlined"
        v-tooltip="
          isRangeMode(optionKey) ? 'Switch to fixed value' : 'Switch to range'
        "
        @click="toggleRangeMode(optionKey, defaultSingle)"
        class="pg-field-toggle"
      >
        <ArrowLeftRight :size="14" />
      </Button>
      <PlaygroundFieldReset
        v-if="store.isOptionSet(optionKey)"
        @click="resetRangeField(optionKey)"
      />
      <span class="pg-field-value" v-if="isRangeMode(optionKey)"
        >{{ displayRange[0] }}{{ unit }} — {{ displayRange[1] }}{{ unit }}</span
      >
      <span class="pg-field-value" v-else>{{ singleVal }}{{ unit }}</span>
    </div>
    <Slider
      v-if="isRangeMode(optionKey)"
      v-model="rangeVal"
      :range="true"
      :min="min"
      :max="max"
      :step="step"
    />
    <Slider v-else v-model="singleVal" :min="min" :max="max" :step="step" />
  </div>
</template>
