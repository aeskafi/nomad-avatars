<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';
import { Search, Sun, Moon } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import UiIcon from '@theme/components/ui/UiIcon.vue';
import type { ThemeOptions } from '@theme/types';

const { isDark, theme } = useData<ThemeOptions>();

const starCount = computed(() => {
  return theme.value.githubStars?.['dicebear/dicebear'] ?? '';
});

function toggleTheme() {
  isDark.value = !isDark.value;
}

function openSearch() {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
  );
}
</script>

<template>
  <div class="layout-nav-actions">
    <button
      class="layout-nav-actions-search"
      aria-label="Search"
      @click="openSearch"
    >
      <Search :size="16" :stroke-width="2.5" />
    </button>
    <button
      class="layout-nav-actions-theme"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggleTheme"
    >
      <Sun v-show="isDark" :size="16" :stroke-width="2.5" />
      <Moon v-show="!isDark" :size="16" :stroke-width="2.5" />
    </button>
    <a
      href="https://github.com/dicebear/dicebear"
      target="_blank"
      rel="noopener noreferrer"
      class="layout-nav-actions-star"
      aria-label="Star DiceBear on GitHub"
    >
      <UiIcon :path="siGithub.path" :size="16" />
      <span class="layout-nav-actions-star-label">Star</span>
      <span v-if="starCount" class="layout-nav-actions-star-count">{{
        starCount
      }}</span>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.layout-nav-actions {
  --star-accent: #eab308;
  --star-accent-soft: rgba(234, 179, 8, 0.12);
  --star-accent-border: rgba(234, 179, 8, 0.4);
  --star-accent-hover: rgba(234, 179, 8, 0.2);
  --star-accent-text: #a16207;

  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

:root.dark .layout-nav-actions {
  --star-accent: #facc15;
  --star-accent-soft: rgba(250, 204, 21, 0.1);
  --star-accent-border: rgba(250, 204, 21, 0.35);
  --star-accent-hover: rgba(250, 204, 21, 0.16);
  --star-accent-text: #facc15;
}

.layout-nav-actions-star {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: var(--vp-radius-xs);
  border: 1px solid var(--star-accent-border);
  background: var(--star-accent-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-heading);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    background var(--duration-fast) var(--ease-smooth),
    box-shadow var(--duration-fast) var(--ease-smooth);

  &:hover {
    border-color: var(--star-accent);
    background: var(--star-accent-hover);
    box-shadow: 0 0 0 3px var(--star-accent-soft);
  }
}

.layout-nav-actions-star-label {
  display: inline-block;
}

.layout-nav-actions-star-count {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  margin-left: 1px;
  border-radius: var(--vp-radius-xs);
  background: var(--star-accent-hover);
  color: var(--star-accent-text);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}

.layout-nav-actions-search,
.layout-nav-actions-theme {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--vp-radius-xs);
  border: 1px solid var(--p-form-field-border-color, var(--vp-c-divider));
  background: var(--vp-c-bg);
  color: var(--ui-c-text-muted);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    color var(--duration-fast) var(--ease-smooth),
    background var(--duration-fast) var(--ease-smooth),
    box-shadow var(--duration-fast) var(--ease-smooth);

  :deep(svg) {
    pointer-events: none;
  }

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
  }
}

/* Hide "Star" label on tighter desktop layouts where the full nav would overflow */
@media (max-width: 959px) {
  .layout-nav-actions-star-label {
    display: none;
  }
}

/* Below VitePress' nav breakpoint (768px) the desktop menu collapses into the
   hamburger — align our own mobile-only rules with that same boundary. */
@media (max-width: 767px) {
  .layout-nav-actions-theme {
    display: none;
  }

  .layout-nav-actions {
    margin-left: 8px;
  }
}
</style>
