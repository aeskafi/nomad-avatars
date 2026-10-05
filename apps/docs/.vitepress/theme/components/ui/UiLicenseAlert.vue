<script setup lang="ts">
import Message from 'primevue/message';
import UiLicenseText from './UiLicenseText.vue';

defineProps<{
  styleName: string;
}>();
</script>

<template>
  <Message severity="secondary" :closable="false" class="ui-license-alert">
    <strong>
      Please note the following license before using the avatar:
    </strong>
    <UiLicenseText :style-name="styleName" />
  </Message>
</template>

<style scoped lang="scss">
.ui-license-alert {
  :deep(.p-message-text) {
    font-size: 14px;
    line-height: 1.5;
  }

  :deep(strong) {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
  }
}
</style>
