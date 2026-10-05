<script setup lang="ts">
import type { Component } from 'vue';
import { UiCard, UiIconBox } from '../ui';

defineProps<{
  highlights: Array<{
    icon: Component;
    title: string;
    description: string;
    color: string;
    link?: string;
  }>;
}>();
</script>

<template>
  <div class="docs-highlights">
    <UiCard
      v-for="highlight in highlights"
      :key="highlight.title"
      :href="highlight.link"
      padding="xl"
      class="docs-highlights-card"
    >
      <UiIconBox
        size="md"
        :color="highlight.color"
        class="docs-highlights-icon"
      >
        <component :is="highlight.icon" />
      </UiIconBox>
      <h3 class="docs-highlights-title">{{ highlight.title }}</h3>
      <p class="docs-highlights-desc">{{ highlight.description }}</p>
    </UiCard>
  </div>
</template>

<style lang="scss" scoped>
.docs-highlights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    &-card {
      --ui-card-padding: 24px;
    }
  }

  &-icon {
    margin-bottom: 16px;
  }

  &-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
    border: none;
    padding: 0;
  }

  &-desc {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.7;
  }
}
</style>
