<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ExternalLink } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import type { ThemeOptions } from '@theme/types';

const store = useStore();
const { theme } = useData<ThemeOptions>();

const definitionUrl = computed(
  () => theme.value.avatarStyles[store.avatarStyleName]?.definitionUrl,
);

const size = computed(
  () => theme.value.avatarStyleSizes.styles[store.avatarStyleName],
);

const fileName = computed(() => {
  const url = definitionUrl.value;

  if (!url) return null;

  const lastSlash = url.lastIndexOf('/');

  return lastSlash >= 0 ? url.slice(lastSlash + 1) : url;
});

function formatSize(bytes: number): string {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} kB`;

  return `${bytes} B`;
}
</script>

<template>
  <a
    v-if="definitionUrl && fileName"
    :href="definitionUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="pg-def"
  >
    <span class="pg-def-main">
      <span class="pg-def-name">{{ fileName }}</span>
      <ExternalLink :size="13" class="pg-def-icon" />
    </span>
    <span v-if="size" class="pg-def-size">
      <span class="pg-def-size-value">{{ formatSize(size.gzip) }}</span>
      <span class="pg-def-size-unit">gzipped</span>
      <span class="pg-def-size-sep">·</span>
      <span class="pg-def-size-value">{{ formatSize(size.raw) }}</span>
      <span class="pg-def-size-unit">raw</span>
    </span>
  </a>
</template>

<style scoped lang="scss">
.pg-def {
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

    .pg-def-name {
      text-decoration-color: var(--vp-c-brand-1);
    }

    .pg-def-icon {
      color: var(--vp-c-brand-1);
      transform: translate(1px, -1px);
    }
  }
}

.pg-def-main {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1.2;
}

.pg-def-name {
  font-family: var(--vp-font-family-mono);
  font-weight: 500;
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--pg-border);
  text-underline-offset: 2px;
  transition: text-decoration-color var(--duration-fast);
  word-break: break-all;
}

.pg-def-icon {
  flex-shrink: 0;
  color: var(--ui-c-text-subtle);
  transition:
    color var(--duration-fast),
    transform var(--duration-fast) var(--ease-smooth);
}

.pg-def-size {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  font-size: 11px;
  line-height: 1.2;
  color: var(--ui-c-text-subtle);
  font-variant-numeric: tabular-nums;
}

.pg-def-size-value {
  font-weight: 600;
  color: var(--ui-c-text-muted);
}

.pg-def-size-sep {
  opacity: 0.5;
  margin: 0 2px;
}
</style>
