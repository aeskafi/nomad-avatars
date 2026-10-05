<script setup lang="ts">
import { Sparkles } from '@lucide/vue';
import UiWindow from './UiWindow.vue';

defineProps<{
  title?: string;
  playgroundUrl?: string;
}>();
</script>

<template>
  <UiWindow :title="title ?? 'Preview'" class="ui-demo-frame">
    <template #header-actions>
      <a
        v-if="playgroundUrl"
        :href="playgroundUrl"
        class="ui-demo-frame-action no-icon"
      >
        <Sparkles :size="14" />
        <span class="ui-demo-frame-action-label">Open Playground</span>
      </a>
      <slot name="actions" />
    </template>

    <div class="ui-demo-frame-body">
      <slot />
    </div>
  </UiWindow>
</template>

<style lang="scss" scoped>
.ui-demo-frame {
  margin: 20px 0 16px;
}

.ui-demo-frame-body {
  padding: 20px;
  /* Faint dotted backdrop (theme-aware); avatars sit centered on top. */
  background-image: radial-gradient(var(--vp-c-divider) 1px, transparent 1px);
  background-size: 16px 16px;
  background-position: center;
}

.ui-demo-frame-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--vp-radius-chrome);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--ui-c-text-muted);
  text-decoration: none;
  transition:
    color var(--duration-fast) var(--ease-smooth),
    background-color var(--duration-fast) var(--ease-smooth);

  &:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}

@media (max-width: 640px) {
  .ui-demo-frame-action-label {
    display: none;
  }
}
</style>
