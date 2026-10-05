<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { formatLicenseName } from '@theme/utils/format';
import { safeHttpUrl } from '@theme/utils/url';

const { theme } = useData<ThemeOptions>();
const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const sourceUrl = computed(() => safeHttpUrl(style.value.meta?.source));
const homepageUrl = computed(() => safeHttpUrl(style.value.meta?.homepage));
const licenseUrl = computed(() => safeHttpUrl(style.value.meta?.license?.url));
</script>

<template>
  <div class="info custom-block">
    <p class="custom-block-title">LICENSE</p>
    <p>
      <template v-if="style.meta?.creator !== 'DiceBear' && style.meta?.title">
        <template v-if="style.meta?.license?.name !== 'MIT'">
          This avatar style is a remix of:
        </template>
        <template v-else> This avatar style is based on: </template>
      </template>
      <a
        v-if="sourceUrl"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ style.meta?.title ?? 'Design' }}
      </a>
      <template v-else>{{ style.meta?.title ?? 'Design' }}</template>
      by
      <a
        v-if="homepageUrl"
        :href="homepageUrl"
        target="_blank"
        rel="noopener noreferrer"
        >{{ style.meta?.creator }}</a
      >
      <template v-else>{{ style.meta?.creator }}</template
      >, licensed under
      <a
        v-if="licenseUrl"
        :href="licenseUrl"
        target="_blank"
        rel="noopener noreferrer"
        >{{ formatLicenseName(style.meta?.license?.name) }}</a
      >
      <template v-else>{{
        formatLicenseName(style.meta?.license?.name)
      }}</template
      >.
      <template v-if="style.meta?.license?.name !== 'MIT'">
        See <a href="#details">details</a> for more information.
      </template>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.custom-block {
  padding: 20px;
  /* Neutral elevated fill (shared framed-box surface) instead of VitePress's
     bluish info tint, so this box matches the preview frame and usage card. */
  --vp-custom-block-info-bg: var(--ui-window-bg);
}
</style>
