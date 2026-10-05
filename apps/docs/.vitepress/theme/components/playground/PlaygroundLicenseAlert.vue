<script setup lang="ts">
import { UiCard } from '@theme/components/ui';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
</script>

<template>
  <UiCard padding="sm" class="playground-license-alert">
    <strong>
      Please note the following license before using the avatar:
    </strong>
    <PlaygroundLicenseText />
  </UiCard>
</template>

<style scoped lang="scss">
.playground-license-alert {
  font-size: 14px;
  line-height: 1.5;

  :deep(strong) {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
  }
}
</style>
