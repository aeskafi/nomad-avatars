<script setup lang="ts">
defineProps<{
  size?: 'md' | 'sm';
}>();
</script>

<template>
  <div :class="['ui-container', `ui-container-size-${size || 'md'}`]">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.ui-container {
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;

  &-size-md {
    max-width: 1200px;
  }

  &-size-sm {
    max-width: 960px;
  }

  @media (max-width: 640px) {
    padding: 0 16px;
  }
}
</style>
