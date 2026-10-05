<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="ui-window">
    <div class="ui-window-header">
      <span v-if="title" class="ui-window-title">{{ title }}</span>
      <div class="ui-window-header-actions">
        <slot name="header-actions" />
      </div>
    </div>
    <div class="ui-window-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --ui-window-divider-color: rgba(0, 0, 0, 0.05);
}
.dark {
  --ui-window-divider-color: rgba(255, 255, 255, 0.04);
}
</style>

<style lang="scss" scoped>
.ui-window {
  position: relative;
  border-radius: var(--window-radius, var(--vp-radius-sm));
  overflow: hidden;
  background: var(--ui-window-bg);
  border: 1px solid var(--ui-window-border-color);
  transition: border-color var(--duration-mid) var(--ease-smooth);

  &-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    position: relative;
    z-index: 1;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--ui-window-border-color);

    &-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &-title {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--vp-font-family-base);
    color: var(--vp-c-text-1);
    letter-spacing: -0.005em;
  }

  &-body {
    position: relative;
    z-index: 1;
  }
}
</style>
