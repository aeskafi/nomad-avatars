<script setup lang="ts">
import { computed } from 'vue';
import Select from 'primevue/select';
import useStore from '@theme/stores/playground';
import { webSafeFonts, fontWeights } from '@theme/utils/avatar/fonts';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const fontFamilyOptions = [...webSafeFonts];
const fontWeightOptions = [...fontWeights];

defineProps<{
  hasFontFamily: boolean;
  hasFontWeight: boolean;
}>();

const store = useStore();

const fontFamilyKey = 'fontFamily';
const fontWeightKey = 'fontWeight';

const fontFamily = computed({
  get: () => {
    const val = store.avatarStyleOptions[fontFamilyKey];

    if (typeof val === 'string') return val;

    return 'system-ui';
  },
  set: (val: string) => {
    if (val === 'system-ui') {
      delete store.avatarStyleOptions[fontFamilyKey];
    } else {
      store.avatarStyleOptions[fontFamilyKey] = val;
    }
  },
});

const fontWeight = computed({
  get: () => {
    const val = store.avatarStyleOptions[fontWeightKey];

    if (typeof val === 'number') return val;

    return 400;
  },
  set: (val: number) => {
    if (val === 400) {
      delete store.avatarStyleOptions[fontWeightKey];
    } else {
      store.avatarStyleOptions[fontWeightKey] = val;
    }
  },
});
</script>

<template>
  <div class="pg-font">
    <div class="pg-field" v-if="hasFontFamily">
      <div class="pg-field-label">
        <span>Font Family</span>
        <PlaygroundFieldReset
          v-if="store.isOptionSet(fontFamilyKey)"
          @click="store.resetOption(fontFamilyKey)"
        />
      </div>
      <Select
        v-model="fontFamily"
        :options="fontFamilyOptions"
        class="pg-field-select"
      />
    </div>

    <div class="pg-field" v-if="hasFontWeight">
      <div class="pg-field-label">
        <span>Font Weight</span>
        <PlaygroundFieldReset
          v-if="store.isOptionSet(fontWeightKey)"
          @click="store.resetOption(fontWeightKey)"
        />
      </div>
      <Select
        v-model="fontWeight"
        :options="fontWeightOptions"
        option-label="label"
        option-value="value"
        class="pg-field-select"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-font {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
