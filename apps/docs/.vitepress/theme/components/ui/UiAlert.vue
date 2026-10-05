<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'error';
}>();
</script>

<template>
  <div :class="['ui-alert', `ui-alert-${type || 'info'}`]">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.ui-alert {
  padding: 16px;
  border-radius: var(--vp-radius-xs);
  font-size: 14px;
  line-height: 1.6;

  &-info {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-text-1);
  }

  &-warning {
    background: var(--vp-c-warning-soft);
    color: var(--vp-c-text-1);
  }

  &-error {
    background: var(--vp-c-danger-soft);
    color: var(--vp-c-text-1);
  }
}
</style>
