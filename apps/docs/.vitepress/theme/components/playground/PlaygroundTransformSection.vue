<script setup lang="ts">
import { computed } from 'vue';
import Slider from 'primevue/slider';
import SelectButton from 'primevue/selectbutton';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const store = useStore();
const { singleComputed } = useRangeField(store.avatarStyleOptions);

const flipKey = 'flip';
const borderRadiusKey = 'borderRadius';

const flipOptions = ['none', 'horizontal', 'vertical', 'both'];

const flip = computed({
  get: () => {
    const val = store.avatarStyleOptions[flipKey];

    return typeof val === 'string' ? val : 'none';
  },
  set: (val: string) => {
    if (val === 'none') {
      delete store.avatarStyleOptions[flipKey];
    } else {
      store.avatarStyleOptions[flipKey] = val;
    }
  },
});

const borderRadius = singleComputed(borderRadiusKey, 0);
</script>

<template>
  <div class="pg-transform">
    <div class="pg-transform-body">
      <div class="pg-field">
        <div class="pg-field-label">
          <span>Flip</span>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(flipKey)"
            @click="store.resetOption(flipKey)"
          />
        </div>
        <SelectButton
          v-model="flip"
          :options="flipOptions"
          :allow-empty="false"
          class="pg-transform-flip"
        />
      </div>

      <PlaygroundRangeField
        label="Rotate"
        option-key="rotate"
        :min="-360"
        :max="360"
        :step="1"
        unit="°"
        :default-single="0"
      />

      <PlaygroundRangeField
        label="Scale"
        option-key="scale"
        :min="0"
        :max="10"
        :step="0.01"
        :default-single="1"
      />

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Border Radius</span>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(borderRadiusKey)"
            @click="store.resetOption(borderRadiusKey)"
          />
          <span class="pg-field-value">{{ borderRadius }}</span>
        </div>
        <Slider v-model="borderRadius" :min="0" :max="50" :step="1" />
      </div>

      <PlaygroundRangeField
        label="Translate X"
        option-key="translateX"
        :min="-100"
        :max="100"
        :step="1"
        unit="%"
        :default-single="0"
      />

      <PlaygroundRangeField
        label="Translate Y"
        option-key="translateY"
        :min="-100"
        :max="100"
        :step="1"
        unit="%"
        :default-single="0"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-transform {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-transform-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Let the Flip SelectButton keep its natural button widths and scroll
   horizontally on narrow viewports instead of squeezing the labels. */
.pg-transform-flip {
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  :deep(.p-togglebutton) {
    flex: 0 0 auto;
  }
}
</style>
