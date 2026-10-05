<script setup lang="ts">
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { computedAsync } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    size?: number;
    styleName: string;
    styleOptions: Record<string, unknown>;
    mode?: 'library' | 'http-api';
    alt?: string;
  }>(),
  {
    mode: 'http-api',
    alt: 'avatar',
  },
);

const svg = computedAsync(() => {
  const styleName = props.styleName;
  const styleOptions = props.styleOptions;

  switch (props.mode) {
    case 'library':
      return loadAvatarStyle(styleName)
        .then((avatarStyle) =>
          new Avatar(avatarStyle, clonePlain(styleOptions)).toDataUri(),
        )
        .catch((e) => {
          if (import.meta.env.DEV) {
            console.warn('Avatar render failed:', e);
          }

          return undefined;
        });
    case 'http-api':
      return getAvatarApiUrl(styleName, styleOptions);
  }
});
</script>

<template>
  <div class="ui-avatar">
    <img :src="svg" v-if="svg" :alt="alt" loading="lazy" />
  </div>
</template>

<style>
:root {
  --ui-avatar-bg-1: rgba(0, 0, 0, 0.02);
  --ui-avatar-bg-2: rgba(0, 0, 0, 0.07);
}

.dark {
  --ui-avatar-bg-1: rgba(255, 255, 255, 0.02);
  --ui-avatar-bg-2: rgba(255, 255, 255, 0.07);
}
</style>

<style scoped>
.ui-avatar {
  width: calc(v-bind(size) * 1px);
  height: calc(v-bind(size) * 1px);
  border-radius: 3px;
  background: repeating-conic-gradient(
      var(--ui-avatar-bg-1) 0% 25%,
      var(--ui-avatar-bg-2) 0% 50%
    )
    50% / 12px 12px;
  line-height: 0;
  overflow: hidden;

  img {
    height: 100%;
    width: 100%;
  }
}
</style>
