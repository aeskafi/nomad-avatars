<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { UiAvatar } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const listRef = ref<HTMLElement>();
const isVisible = useVisibility(listRef, { once: false, threshold: 0.1 });

const avatarStyles = ['thumbs', 'initials', 'shapes', 'lorelei', 'pixel-art'];
const styleA = ref(avatarStyles[0]);
const styleB = ref(avatarStyles[1]);
const activeLayer = ref<'a' | 'b'>('a');
let styleCounter = 0;

let interval: ReturnType<typeof setInterval> | null = null;

function tick() {
  styleCounter++;
  const nextStyle = avatarStyles[styleCounter % avatarStyles.length];

  if (activeLayer.value === 'a') {
    styleB.value = nextStyle;
    activeLayer.value = 'b';
  } else {
    styleA.value = nextStyle;
    activeLayer.value = 'a';
  }
}

watch(isVisible, (visible) => {
  if (visible && !interval) {
    interval = setInterval(tick, 3000);
  } else if (!visible && interval) {
    clearInterval(interval);
    interval = null;
  }
});

onMounted(() => {
  if (isVisible.value) {
    interval = setInterval(tick, 3000);
  }
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

const users = [
  { name: 'Iris W.', position: 'Product Designer', online: true },
  { name: 'Leon B.', position: 'Frontend Dev', online: true },
  { name: 'Cara M.', position: 'Team Lead', online: true },
  { name: 'Finn H.', position: 'Backend Dev', online: false },
  { name: 'Yuki S.', position: 'UX Researcher', online: false },
];
</script>

<template>
  <div ref="listRef" class="app-hero-aside-user-list">
    <div
      v-for="(user, index) in users"
      :key="user.name"
      class="app-hero-aside-user-list-card"
      :style="{ animationDelay: `${index * 0.12}s` }"
    >
      <div class="app-hero-aside-user-list-avatar">
        <UiAvatar
          class="app-hero-aside-user-list-layer"
          :class="{
            'app-hero-aside-user-list-layer-active': activeLayer === 'a',
          }"
          :style-name="styleA"
          :style-options="{ seed: user.name, size: 80 }"
          :alt="user.name"
        />
        <UiAvatar
          class="app-hero-aside-user-list-layer"
          :class="{
            'app-hero-aside-user-list-layer-active': activeLayer === 'b',
          }"
          :style-name="styleB"
          :style-options="{ seed: user.name, size: 80 }"
          :alt="user.name"
        />
      </div>
      <div class="app-hero-aside-user-list-info">
        <span class="app-hero-aside-user-list-name">{{ user.name }}</span>
        <span class="app-hero-aside-user-list-position">{{
          user.position
        }}</span>
      </div>
      <span
        class="app-hero-aside-user-list-status"
        :class="
          user.online
            ? 'app-hero-aside-user-list-status-online'
            : 'app-hero-aside-user-list-status-offline'
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-hero-aside-user-list {
  position: relative;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transform: perspective(800px) rotateY(-8deg) rotateX(4deg);
  transform-style: preserve-3d;

  &-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-radius: var(--vp-radius-md);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 1px 3px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    opacity: 0;

    .visible & {
      animation: reveal-up 0.5s var(--ease-smooth) forwards;
    }
  }

  &-avatar {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: var(--vp-radius-sm);
    overflow: hidden;
    flex-shrink: 0;
  }

  &-layer {
    position: absolute;
    inset: 0;
    width: 48px !important;
    height: 48px !important;
    border-radius: var(--vp-radius-sm);
    opacity: 0;
    transition: opacity var(--duration-slow) ease;

    &-active {
      opacity: 1;
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  &-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-position {
    font-size: 12px;
    line-height: 1.4;
    color: var(--vp-c-text-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &-online {
      background: #22c55e;
      box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
    }

    &-offline {
      background: var(--vp-c-text-3);
    }
  }
}

.dark .app-hero-aside-user-list-card {
  background: linear-gradient(
    135deg,
    rgba(40, 40, 45, 0.92) 0%,
    rgba(35, 35, 40, 0.88) 100%
  );
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.25),
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
@media (max-width: 768px) {
  .app-hero-aside-user-list {
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
