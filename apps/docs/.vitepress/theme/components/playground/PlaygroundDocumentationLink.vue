<script setup lang="ts">
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import useStore from '@theme/stores/playground';

const store = useStore();

const url = computed(() => `/styles/${kebabCase(store.avatarStyleName)}/`);
</script>

<template>
  <a :href="url" class="pg-doc-link">
    <span class="pg-doc-main">
      <span class="pg-doc-label">Style documentation</span>
      <ArrowRight :size="13" class="pg-doc-arrow" />
    </span>
    <span class="pg-doc-hint"
      >Full options reference, code examples, and integration guides.</span
    >
  </a>
</template>

<style scoped lang="scss">
.pg-doc-link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none;
  color: var(--ui-c-text-muted);
  transition: color var(--duration-fast);

  &:hover,
  &:focus-visible {
    color: var(--vp-c-brand-1);
    outline: none;

    .pg-doc-label {
      text-decoration-color: var(--vp-c-brand-1);
    }

    .pg-doc-arrow {
      color: var(--vp-c-brand-1);
      transform: translateX(2px);
    }
  }
}

.pg-doc-main {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1.2;
}

.pg-doc-label {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--pg-border);
  text-underline-offset: 2px;
  transition: text-decoration-color var(--duration-fast);
}

.pg-doc-arrow {
  flex-shrink: 0;
  color: var(--ui-c-text-subtle);
  transition:
    color var(--duration-fast),
    transform var(--duration-fast) var(--ease-smooth);
}

.pg-doc-hint {
  font-size: 11px;
  line-height: 1.2;
  color: var(--ui-c-text-subtle);
}
</style>
