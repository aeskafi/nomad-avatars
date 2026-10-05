<script setup lang="ts">
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';

defineProps<{
  headline?: string;
  description?: string;
  tag?: 'h1' | 'h2' | 'h3';
}>();
</script>

<template>
  <div class="ui-section-header">
    <UiHeadline :tag="tag">
      <slot name="headline">{{ headline }}</slot>
    </UiHeadline>
    <UiDescription v-if="$slots.description || description">
      <slot name="description">{{ description }}</slot>
    </UiDescription>
    <slot name="after-description" />
  </div>
</template>

<style lang="scss" scoped>
.ui-section-header {
  text-align: center;
  margin-bottom: 64px;
}
</style>
