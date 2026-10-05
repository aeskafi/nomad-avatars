<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import Preview from './components/Preview.vue';
import Options from './components/Options.vue';
import useMainStore from './stores/main';
import tinycolor from 'tinycolor2';
import Header from './components/Header.vue';
import OptionsTabs from './components/OptionsTabs.vue';
import { useElementSize } from '@vueuse/core';
import { ref } from 'vue';

const i18n = useI18n();
const store = useMainStore();

const header = ref<HTMLDivElement>();
const preview = ref<HTMLDivElement>();

const { height: headerHeight } = useElementSize(header);
const { height: previewHeight } = useElementSize(preview);

const navOffsetTop = computed(() => {
  return headerHeight.value + previewHeight.value + 8;
});

const backgroundColor = computed(() => {
  const color =
    store.selectedStyleOptions.backgroundColor == 'transparent'
      ? '#ffffff'
      : `#${store.selectedStyleOptions.backgroundColor}`;

  return tinycolor(color).darken(10).toHexString();
});

watchEffect(() => (document.documentElement.lang = i18n.locale.value));
</script>

<template>
  <div class="app">
    <div class="app-header" ref="header">
      <Header />
    </div>
    <div class="app-preview" ref="preview">
      <Preview />
    </div>
    <div class="app-tabs">
      <OptionsTabs />
    </div>
    <div class="app-options">
      <Options :navOffetTop="navOffsetTop" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100%;

  background: v-bind('backgroundColor');
  background-image:
    linear-gradient(white, white),
    linear-gradient(v-bind('backgroundColor'), v-bind('backgroundColor'));
  background-position:
    center center,
    left top;
  background-size:
    960px 100%,
    100% 100%;
  background-repeat: no-repeat;

  &-header,
  &-preview,
  &-tabs,
  &-options {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
  }

  &-header {
    padding: 0 20px;
    max-width: 1000px;
    top: 0;
    z-index: 100;
  }

  &-preview {
    top: calc(v-bind('headerHeight') * 1px);
    z-index: 1;
  }

  &-tabs {
    z-index: 1;
    top: calc((v-bind('headerHeight') + v-bind('previewHeight')) * 1px);
  }

  &-header,
  &-preview,
  &-tabs {
    position: sticky;
    background-color: v-bind('backgroundColor');
  }
}
</style>
