<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';
import type { AvatarStyleMeta, ThemeOptions } from '@theme/types';
import { safeHttpUrl } from '@theme/utils/url';

const { theme } = useData<ThemeOptions>();

const styles = computed(() => {
  const result: AvatarStyleMeta[] = [];
  const knownWork: string[] = [];

  for (const val of Object.values(theme.value.avatarStyles)) {
    if (
      val.meta.creator === 'Florian Körner' ||
      val.meta.creator === 'DiceBear'
    ) {
      continue;
    }

    if (val.meta.source) {
      if (knownWork.includes(val.meta.source)) {
        continue;
      }

      knownWork.push(val.meta.source);
    }

    result.push(val.meta);
  }

  return result;
});
</script>

<template>
  <div class="layout-footer-bottom">
    <div class="layout-footer-container">
      <div class="layout-footer-bottom-inner">
        <p class="layout-footer-attributions">
          <template v-for="style in styles" :key="style.source">
            <a
              v-if="safeHttpUrl(style.source)"
              class="layout-footer-attribution-link"
              :href="safeHttpUrl(style.source)"
              target="_blank"
              rel="noopener"
              >{{ style.title }}</a
            >
            <template v-else>{{ style.title }}</template>
            by {{ style.creator }} /
            <a
              v-if="safeHttpUrl(style.license?.url)"
              class="layout-footer-attribution-link"
              :href="safeHttpUrl(style.license?.url)"
              target="_blank"
              rel="noopener"
              >{{ style.license?.name }}</a
            >
            <template v-else>{{ style.license?.name }}</template
            >.
          </template>
          — All avatars are remixes of the original works.
        </p>
      </div>
    </div>
  </div>
</template>
