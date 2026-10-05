<script setup lang="ts">
import { computed } from 'vue';
import { UiAvatar, UiCard } from '../ui';
import useStore from '@theme/stores/playground';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';
import PlaygroundButtonCopy from './PlaygroundButtonCopy.vue';
import PlaygroundButtonHowToUse from './PlaygroundButtonHowToUse.vue';
import PlaygroundCombinationCount from './PlaygroundCombinationCount.vue';
import PlaygroundDefinitionInfo from './PlaygroundDefinitionInfo.vue';
import PlaygroundDocumentationLink from './PlaygroundDocumentationLink.vue';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();

const styleOptions = computed(() => ({
  ...store.avatarStyleOptionsWithoutDefaults,
  seed: props.seed,
}));
</script>

<template>
  <div class="pg-preview">
    <div class="pg-preview-frame">
      <div class="pg-preview-canvas">
        <UiAvatar
          :size="320"
          :style-name="store.avatarStyleName"
          :style-options="styleOptions"
          mode="library"
          class="pg-preview-avatar"
        />
      </div>
    </div>

    <div class="pg-preview-actions">
      <PlaygroundButtonHowToUse :seed="seed" />
      <PlaygroundButtonDownload :seed="seed" />
      <PlaygroundButtonCopy :seed="seed" />
    </div>

    <div class="pg-preview-meta">
      <h3 class="pg-preview-meta-title">Details</h3>
      <UiCard padding="sm" flush>
        <div class="pg-preview-meta-row">
          <PlaygroundCombinationCount />
        </div>
        <div v-if="!store.isCustomStyle" class="pg-preview-meta-row">
          <PlaygroundDocumentationLink />
        </div>
        <div v-if="!store.isCustomStyle" class="pg-preview-meta-row">
          <PlaygroundDefinitionInfo />
        </div>
        <div class="pg-preview-meta-row pg-preview-meta-license">
          <PlaygroundLicenseText />
        </div>
      </UiCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pg-preview-frame {
  width: 100%;
  border-radius: var(--vp-radius-sm);
  border: 1px solid var(--pg-border);
  overflow: hidden;
  background: var(--vp-c-bg);
}

.pg-preview-canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px 24px;
  background: repeating-conic-gradient(
      var(--vp-c-bg-soft) 0% 25%,
      var(--vp-c-bg) 0% 50%
    )
    50% / 20px 20px;

  @media (max-width: 540px) {
    padding: 24px 16px;
  }
}

.pg-preview-avatar {
  --ui-avatar-bg-1: transparent;
  --ui-avatar-bg-2: transparent;

  max-width: 100%;
  height: auto;

  @media (max-width: 540px) {
    max-width: 220px;
  }

  :deep(svg),
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

.pg-preview-meta {
  width: 100%;
  margin-top: 16px;
  /* Match the left config accordion's surface (PrimeVue content background =
     --vp-c-bg-soft) instead of the elevated card surface, so the details panel
     reads as the same surface as the options accordion on the left. */
  --ui-card-bg: var(--p-content-background);
}

.pg-preview-meta-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-c-text-subtle);
  margin: 0 0 8px 2px;
  border: none;
  padding: 0;
}

.pg-preview-meta-row {
  padding: 12px 16px;

  & + & {
    border-top: 1px solid var(--ui-card-border-color);
  }
}

.pg-preview-meta-license {
  font-size: 12px;
  line-height: 1.45;

  :deep(p) {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    color: var(--ui-c-text-muted);
  }

  :deep(a) {
    color: var(--ui-c-text-muted);
    text-decoration: underline;
    text-decoration-color: var(--pg-border);
    text-underline-offset: 2px;
    transition:
      color var(--duration-fast),
      text-decoration-color var(--duration-fast);

    &:hover {
      color: var(--vp-c-brand-1);
      text-decoration-color: var(--vp-c-brand-1);
    }
  }
}

.pg-preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  :deep(> *) {
    flex: 1 1 160px;
    min-width: 0;
  }

  :deep(button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
