<script setup lang="ts">
import { inject } from 'vue';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { Weight } from '@lucide/vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import { useVariantWeights } from '@theme/composables/useVariantWeights';
import {
  componentPreviewKey,
  componentPreviewDefault,
} from '@theme/components/styles/styleOptionsKeys';

const props = defineProps<{
  componentName: string;
  variants: string[];
  hasProbability: boolean;
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number>;
  defaultProbability: number;
}>();

const store = useStore();
const preview = inject(componentPreviewKey, componentPreviewDefault);

const {
  showWeights,
  variantWeights,
  toggleWeights,
  toggleVariant,
  setWeight,
  selectAll,
  selectNone,
} = useVariantWeights(
  store.avatarStyleOptions,
  () => props.componentName,
  () => props.variants,
  () => props.hasNonDefaultWeights,
  () => props.defaultWeights,
);

const { singleComputed } = useRangeField(store.avatarStyleOptions);

const variantKey = `${props.componentName}Variant`;
const probabilityKey = `${props.componentName}Probability`;

const probability = singleComputed(
  probabilityKey,
  () => props.defaultProbability,
);

function resetVariants() {
  store.resetOption(variantKey);
  showWeights.value = props.hasNonDefaultWeights;
}
</script>

<template>
  <div class="pg-comp-body">
    <div class="pg-field" v-if="hasProbability">
      <div class="pg-field-label">
        <span>Probability</span>
        <PlaygroundFieldReset
          v-if="store.isOptionSet(probabilityKey)"
          @click="store.resetOption(probabilityKey)"
        />
        <span class="pg-field-value">{{ probability }}%</span>
      </div>
      <Slider v-model="probability" :min="0" :max="100" :step="1" />
    </div>

    <div v-if="variants.length > 0" class="pg-comp-variants">
      <div class="pg-field-label">
        <span>Variants</span>
        <Button
          size="small"
          :severity="showWeights ? 'primary' : 'secondary'"
          variant="outlined"
          v-tooltip="showWeights ? 'Hide weights' : 'Show weights'"
          @click="toggleWeights"
          class="pg-field-toggle"
        >
          <Weight :size="14" />
        </Button>
        <Button
          label="All"
          size="small"
          severity="secondary"
          variant="outlined"
          @click="selectAll"
          class="pg-field-toggle"
        />
        <Button
          label="None"
          size="small"
          severity="secondary"
          variant="outlined"
          @click="selectNone"
          class="pg-field-toggle"
        />
        <PlaygroundFieldReset
          v-if="store.isOptionSet(variantKey)"
          @click="resetVariants"
        />
      </div>
      <div class="pg-comp-variants-grid">
        <div
          v-for="variant in variants"
          :key="variant"
          class="pg-comp-variant"
          :class="{
            'pg-comp-variant-off': variantWeights[variant] === undefined,
          }"
        >
          <button
            class="pg-comp-variant-btn"
            :class="{
              'pg-comp-variant-btn-active':
                variantWeights[variant] !== undefined,
            }"
            @click="toggleVariant(variant)"
          >
            <img
              v-if="preview"
              :src="preview.toDataUri(componentName, variant)"
              alt=""
              class="pg-comp-variant-img"
            />
          </button>
          <span class="pg-comp-variant-name">{{ variant }}</span>
          <InputNumber
            v-if="showWeights && variantWeights[variant] !== undefined"
            v-tooltip="'Weight — higher values increase probability'"
            :model-value="variantWeights[variant]"
            @update:model-value="
              (val: number) => setWeight(variant, Math.max(0, val ?? 0))
            "
            :min="0"
            :min-fraction-digits="0"
            :max-fraction-digits="2"
            :show-buttons="false"
            locale="en-US"
            class="pg-comp-variant-weight"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-comp-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pg-comp-variants {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pg-comp-variants-grid {
  display: grid;
  /* `minmax(0, 1fr)` allows the columns to shrink below the intrinsic
     content width — without it long variant names would push the
     tracks wider than the container. */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.pg-comp-variant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  /* Allow flex children (e.g. the variant name) to shrink so the
     ellipsis can engage. */
  min-width: 0;
  transition: opacity var(--duration-fast) ease;

  &-off {
    opacity: 0.25;
  }
}

.pg-comp-variant-btn {
  width: 100%;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: var(--vp-radius-xs);
  background: none;
  cursor: pointer;
  transition: all var(--duration-fast) ease;

  &-active {
    border-color: var(--p-primary-color);
  }

  &:hover {
    border-color: var(--p-primary-200);
  }
}

.pg-comp-variant-img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border-radius: 3px;
  background: repeating-conic-gradient(
      var(--ui-avatar-bg-1, rgba(0, 0, 0, 0.02)) 0% 25%,
      var(--ui-avatar-bg-2, rgba(0, 0, 0, 0.07)) 0% 50%
    )
    50% / 12px 12px;
}

.pg-comp-variant-name {
  font-size: 9px;
  color: var(--ui-c-text-subtle);
  /* `width: 100%` (not `max-width`) ensures the span fills the
     column so the ellipsis can clip long names cleanly. */
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.pg-comp-variant-weight {
  width: 40px;

  :deep(input) {
    width: 40px;
    height: 20px;
    padding: 0 4px;
    font-size: 11px;
    text-align: center;
  }
}
</style>
