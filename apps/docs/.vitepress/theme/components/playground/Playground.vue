<script setup lang="ts">
import LayoutClientOnly from '@theme/components/layout/LayoutClientOnly.vue';
import PlaygroundLoader from './PlaygroundLoader.vue';
import PlaygroundContent from './PlaygroundContent.vue';
</script>

<template>
  <LayoutClientOnly>
    <template #default>
      <PlaygroundContent />
    </template>
    <template #fallback>
      <PlaygroundLoader />
    </template>
  </LayoutClientOnly>
</template>
