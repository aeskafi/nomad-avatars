<script setup lang="ts">
import { UiCard } from '../ui';

withDefaults(
  defineProps<{
    items: Array<{ title: string; description: string; badge?: string }>;
    columns?: 2 | 3;
  }>(),
  {
    columns: 3,
  },
);
</script>

<template>
  <div class="docs-grid" :class="`docs-grid-cols-${columns}`">
    <UiCard v-for="item in items" :key="item.title" class="docs-grid-card">
      <div class="docs-grid-header">
        <span class="docs-grid-title">{{ item.title }}</span>
        <Badge v-if="item.badge" type="tip">{{ item.badge }}</Badge>
      </div>
      <p class="docs-grid-desc">{{ item.description }}</p>
    </UiCard>
  </div>
</template>

<style lang="scss" scoped>
.docs-grid {
  display: grid;
  gap: 12px;
  margin: 24px 0;

  &-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    &-cols-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    &-cols-2,
    &-cols-3 {
      grid-template-columns: 1fr;
    }
  }

  &-card {
    :deep(.ui-card-body) {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  &-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  &-desc {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.7;
  }
}
</style>
