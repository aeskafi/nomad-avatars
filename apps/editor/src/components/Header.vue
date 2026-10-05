<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import useMainStore from '@/stores/main';
import getRandomOptions from '@/utils/getRandomOptions';
import availableStyles from '@/config/styles';
import getApiUrl from '@/utils/getApiUrl';
import { computed, ref } from 'vue';
import { useFullscreen } from '@vueuse/core';

const { t } = useI18n();
const store = useMainStore();
const show = ref(false);
const copiedSvg = ref(false);
const { isFullscreen, enter } = useFullscreen();

const styleMeta = computed(() => {
  const meta = availableStyles[store.selectedStyleName].style.meta();

  return {
    title: meta.source().name(),
    source: meta.source().url(),
    creator: meta.creator().name(),
    homepage: meta.creator().url(),
    license: {
      name: meta.license().name(),
      url: meta.license().url(),
    },
  };
});

function onShuffle() {
  store.selectedStyleOptions = getRandomOptions(
    availableStyles[store.selectedStyleName].options,
  );
}

function onNomadShuffle() {
  const styleKeys = Object.keys(availableStyles);
  const randomKey = styleKeys[Math.floor(Math.random() * styleKeys.length)];
  store.selectedStyleName = randomKey;
  store.selectedStyleOptions = getRandomOptions(availableStyles[randomKey].options);
}

async function onCopySvg() {
  try {
    const svg = store.selectedStylePreview.toString();
    await navigator.clipboard.writeText(svg);
    copiedSvg.value = true;
    setTimeout(() => {
      copiedSvg.value = false;
    }, 2200);
  } catch (err) {
    console.error('Failed to copy SVG', err);
  }
}

function onDownloadSvg() {
  const svg = store.selectedStylePreview.toString();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const file = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();

  const link = document.createElement('a');
  link.href = file;
  link.download = `nomad-avatar-${store.selectedStyleName}-${timestamp}.svg`;
  link.target = '_blank';
  link.click();
  link.remove();

  URL.revokeObjectURL(file);
}

async function onDownload() {
  show.value = true;

  const apiUrl = getApiUrl(
    store.selectedStyleName,
    store.selectedStyleOptions,
    'png',
  );

  const response = await fetch(apiUrl);
  const blob = await response.blob();
  const file = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();

  const link = document.createElement('a');
  link.href = file;
  link.download = `${store.selectedStyleName}-${timestamp}.png`;
  link.target = '_blank';
  link.click();
  link.remove();

  URL.revokeObjectURL(file);
}

function onFullscreen() {
  enter();
}
</script>

<template>
  <Dialog
    v-model:visible="show"
    modal
    :draggable="false"
    :header="t('downloadStarted')"
    :style="{ maxWidth: '420px' }"
  >
    <p class="header-dialog-text">{{ t('downloadStartedDescription') }}</p>
    <p
      v-if="styleMeta?.license?.name !== 'CC0 1.0'"
      class="header-dialog-text"
      v-html="
        t('downloadStartedDescriptionLicense', {
          title: styleMeta?.title,
          source: styleMeta?.source,
          creator: styleMeta?.creator,
          homepage: styleMeta?.homepage,
          licenseName: styleMeta?.license?.name,
          licenseUrl: styleMeta?.license?.url,
        })
      "
    ></p>
    <p class="header-dialog-text">
      Curated by <a href="https://arham.dev" target="_blank" rel="noopener">Arham Eskafi</a> · 
      Overland Tech Nomad at <a href="https://youtube.com/@walkcooklive" target="_blank" rel="noopener">Walk Cook Live</a>
    </p>
    <div class="header-dialog-actions">
      <Button
        as="a"
        href="https://github.com/aeskafi/nomad-avatars"
        target="_blank"
        rel="noopener"
        rounded
        severity="secondary"
        icon="pi pi-github"
        label="GitHub Repository"
      />
    </div>
  </Dialog>

  <div class="header">
    <div class="header-actions">
      <Button
        icon="pi pi-sparkles"
        severity="secondary"
        rounded
        title="Shuffle current style options"
        :aria-label="t('shuffle')"
        @click="onShuffle"
      />
      <Button
        icon="pi pi-compass"
        severity="contrast"
        rounded
        title="Nomad Shuffle (Random Style + Features)"
        aria-label="Nomad Shuffle"
        @click="onNomadShuffle"
      />
      <Button
        v-if="!isFullscreen"
        icon="pi pi-window-maximize"
        severity="secondary"
        rounded
        title="Toggle Fullscreen"
        :aria-label="t('shuffle')"
        @click="onFullscreen"
      />
    </div>

    <div class="header-brand">
      <span class="header-brand-title">🌍 NomadAvatars</span>
    </div>

    <div class="header-export">
      <Button
        :icon="copiedSvg ? 'pi pi-check' : 'pi pi-copy'"
        rounded
        :severity="copiedSvg ? 'success' : 'secondary'"
        :label="copiedSvg ? 'Copied SVG!' : 'Copy SVG'"
        @click="onCopySvg"
      />
      <Button
        icon="pi pi-download"
        rounded
        severity="secondary"
        label="SVG"
        title="Download pure vector SVG"
        @click="onDownloadSvg"
      />
      <Button
        rounded
        severity="secondary"
        :label="t('save')"
        title="Export PNG avatar"
        @click="onDownload"
      />
    </div>
  </div>
</template>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  gap: 12px;
  flex-wrap: wrap;

  &-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &-brand {
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    user-select: none;

    &-title {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
  }

  &-export {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &-dialog-text {
    text-align: center;
    font-size: 14px;
    margin: 16px 12px;

    a {
      color: #10b981;
      text-decoration: underline;
    }
  }

  &-dialog-actions {
    display: flex;
    justify-content: center;
    margin: 16px 12px 0;

    a {
      text-decoration: none;
    }
  }
}
</style>
