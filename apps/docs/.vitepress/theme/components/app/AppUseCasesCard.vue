<script setup lang="ts">
import { UiCard } from '../ui';

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <UiCard padding="xl" class="uc-card">
    <div class="uc-card-visual">
      <slot />
    </div>
    <h3 class="uc-card-title">{{ title }}</h3>
    <p class="uc-card-text">{{ description }}</p>
  </UiCard>
</template>

<style lang="scss" scoped>
.uc-card {
  min-height: 340px;

  :deep(.ui-card-body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    margin-bottom: 24px;

    > * {
      width: 100%;
    }
  }

  &-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
  }

  &-text {
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--vp-c-text-2);
    margin: 0;
  }
}
</style>
