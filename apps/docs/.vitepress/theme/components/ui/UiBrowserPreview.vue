<script setup lang="ts">
import { Lock } from '@lucide/vue';

defineProps<{
  url: string;
}>();
</script>

<template>
  <div class="ui-browser-preview">
    <div class="ui-browser-preview-header">
      <div class="ui-browser-preview-dots">
        <span class="ui-browser-preview-dot ui-browser-preview-dot-red"></span>
        <span
          class="ui-browser-preview-dot ui-browser-preview-dot-yellow"
        ></span>
        <span
          class="ui-browser-preview-dot ui-browser-preview-dot-green"
        ></span>
      </div>
      <a
        :href="url"
        target="_blank"
        rel="noopener"
        class="ui-browser-preview-url"
      >
        <Lock class="ui-browser-preview-url-lock" :size="12" />
        <span class="ui-browser-preview-url-text">{{ url }}</span>
      </a>
    </div>
    <div class="ui-browser-preview-body">
      <a
        :href="url"
        target="_blank"
        rel="noopener"
        class="ui-browser-preview-body-anchor"
      >
        <img :src="url" width="94" height="94" alt="preview" loading="lazy" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-browser-preview {
  border-radius: var(--vp-radius-sm);
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--ui-window-border-color);
  margin: 16px 0;

  &-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--ui-window-border-color);
  }

  &-dots {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &-red {
      background: #ff5f57;
    }
    &-yellow {
      background: #febc2e;
    }
    &-green {
      background: #28c840;
    }
  }

  &-url {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
    text-decoration: none;

    &::after {
      display: none !important;
    }

    &-lock {
      flex-shrink: 0;
      color: var(--vp-c-text-3);
    }

    &-text {
      font-size: 13px;
      color: var(--vp-c-text-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-body {
    padding: 24px;

    &-anchor {
      display: inline-block;

      &::after {
        display: none !important;
      }
    }
  }
}
</style>
