<script setup lang="ts">
import Button from 'primevue/button';
import { RotateCcw } from '@lucide/vue';

defineEmits<{ click: [] }>();
</script>

<template>
  <Button
    size="small"
    severity="secondary"
    variant="outlined"
    v-tooltip="'Reset to default'"
    class="pg-field-reset pg-field-toggle"
    @click="$emit('click')"
  >
    <RotateCcw :size="14" />
  </Button>
</template>
