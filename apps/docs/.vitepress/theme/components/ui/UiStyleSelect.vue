<script setup lang="ts">
import { computed } from 'vue';
import { capitalCase } from 'change-case';
import Select from 'primevue/select';
import UiAvatar from './UiAvatar.vue';

const props = withDefaults(
  defineProps<{
    styles: string[];
    seed?: string;
    valueAvatarSize?: number;
    optionAvatarSize?: number;
    filterPlaceholder?: string;
  }>(),
  {
    seed: 'Felix',
    valueAvatarSize: 24,
    optionAvatarSize: 24,
    filterPlaceholder: 'Search styles…',
  },
);

const model = defineModel<string>({ required: true });

const options = computed(() =>
  props.styles.map((name) => ({ name, displayName: capitalCase(name) })),
);
</script>

<template>
  <Select
    v-model="model"
    :options="options"
    option-label="displayName"
    option-value="name"
    filter
    :filter-placeholder="filterPlaceholder"
  >
    <template #value="{ value }">
      <div v-if="value" class="ui-style-select-row">
        <UiAvatar
          :size="valueAvatarSize"
          :style-name="value"
          :style-options="{ seed }"
          mode="library"
        />
        <span>{{ capitalCase(value) }}</span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="ui-style-select-row">
        <UiAvatar
          :size="optionAvatarSize"
          :style-name="option.name"
          :style-options="{ seed }"
          mode="library"
        />
        <span>{{ option.displayName }}</span>
      </div>
    </template>
  </Select>
</template>

<style scoped lang="scss">
.ui-style-select-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
</style>
