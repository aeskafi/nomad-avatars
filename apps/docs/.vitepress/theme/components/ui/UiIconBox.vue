<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}>();
</script>

<template>
  <div
    class="ui-icon-box"
    :class="`ui-icon-box-${size || 'md'}`"
    :style="color ? { '--icon-color': color } : undefined"
  >
    <div class="ui-icon-box-inner">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  --icon-color: var(--vp-c-brand-1);

  &-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--icon-color) 12%, transparent);
    border-radius: var(--vp-radius-sm);
    position: relative;
    z-index: 1;
    transition: all var(--duration-mid) var(--ease-spring);
  }

  /* Sizes */
  &-sm {
    width: 36px;
    height: 36px;
    --icon-svg-size: 18px;

    .ui-icon-box-inner {
      width: 36px;
      height: 36px;
      border-radius: calc(var(--vp-radius-sm) - 2px);
    }
  }

  &-md {
    width: 44px;
    height: 44px;
    --icon-svg-size: 22px;

    .ui-icon-box-inner {
      width: 44px;
      height: 44px;
      border-radius: var(--vp-radius-sm);
    }
  }

  &-lg {
    width: 56px;
    height: 56px;
    --icon-svg-size: 28px;

    .ui-icon-box-inner {
      width: 56px;
      height: 56px;
      border-radius: var(--vp-radius-md);
    }
  }
}
</style>

<style>
.ui-icon-box-inner svg {
  color: var(--icon-color);
  width: var(--icon-svg-size, 22px);
  height: var(--icon-svg-size, 22px);
}
</style>
