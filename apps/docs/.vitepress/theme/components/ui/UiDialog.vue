<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps<{
  open: boolean;
  maxWidth?: string;
  header?: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const visible = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
});

const hasHeaderText = computed(() => !!props.header?.trim());

const rootClass = computed(() =>
  hasHeaderText.value ? 'ui-dialog' : 'ui-dialog ui-dialog--headerless',
);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    dismissable-mask
    :header="hasHeaderText ? header : ' '"
    :style="{ width: maxWidth || '540px', maxWidth: 'calc(100vw - 32px)' }"
    :pt="{
      root: { class: rootClass },
      content: { class: 'ui-dialog-content' },
    }"
  >
    <slot />
  </Dialog>
</template>
