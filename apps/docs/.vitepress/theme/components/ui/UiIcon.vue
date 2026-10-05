<script setup lang="ts">
defineProps<{
  path: string;
  size?: number;
}>();
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :style="size ? { width: `${size}px`, height: `${size}px` } : undefined"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>
