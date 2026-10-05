<script setup lang="ts">
defineProps<{
  align?: 'center' | 'left';
}>();
</script>

<template>
  <p :class="['ui-description', align === 'left' && 'ui-description-left']">
    <slot />
  </p>
</template>

<style lang="scss" scoped>
.ui-description {
  font-size: 20px;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  max-width: 540px;
  line-height: 1.7;
  text-wrap: pretty;

  &-left {
    margin-left: 0;
    margin-right: auto;
    text-align: left;
  }

  @media (max-width: 640px) {
    font-size: 17px;
  }
}
</style>
