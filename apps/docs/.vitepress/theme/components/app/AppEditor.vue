<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  MousePointerClick,
  Palette,
  Download,
  ArrowRight,
  Brush,
} from '@lucide/vue';
import Button from 'primevue/button';
import {
  UiAvatar,
  UiHeadline,
  UiDescription,
  UiContainer,
  UiSection,
  UiWindow,
  UiIconBox,
} from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef);

// Tab configuration
const tabs = ['Background', 'Hair', 'Eyes', 'Nose', 'Mouth'];
const activeTab = ref(0);

// Current avatar options
const currentOptions = ref({
  backgroundColor: 'ffd5dc',
  hair: '',
  eyes: '',
  nose: '',
  mouth: '',
});

// Background colors
const bgColors = [
  'ffd5dc',
  'f8bbd9',
  'ffccbc',
  'ffe0b2',
  'fff9c4',
  'c8e6c9',
  'dcedc8',
  'b2dfdb',
  'b2ebf2',
  'bbdefb',
];

// Variants for each category
const variants = {
  hair: [
    'variant01',
    'variant02',
    'variant03',
    'variant04',
    'variant05',
    'variant06',
    'variant07',
    'variant08',
    'variant09',
    'variant10',
  ],
  eyes: [
    'variant01',
    'variant02',
    'variant03',
    'variant04',
    'variant05',
    'variant06',
    'variant07',
    'variant08',
    'variant09',
    'variant10',
  ],
  nose: [
    'variant01',
    'variant02',
    'variant03',
    'variant04',
    'variant05',
    'variant06',
  ],
  mouth: [
    'happy01',
    'happy02',
    'happy03',
    'happy04',
    'happy05',
    'happy06',
    'happy07',
    'happy08',
    'happy09',
    'happy10',
  ],
};

// Darken a hex color by a percentage
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - percent)));
  const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - percent)));
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Canvas background (slightly darker than avatar background)
const canvasBackground = computed(
  () => `#${darkenColor(currentOptions.value.backgroundColor, 0.15)}`,
);

// Build style options from current options
function buildStyleOptions(options: typeof currentOptions.value) {
  const result: Record<string, unknown> = {
    seed: 'editorUser',
    glassesProbability: 0,
  };
  if (options.backgroundColor) result.backgroundColor = options.backgroundColor;
  if (options.hair) result.hairVariant = options.hair;
  if (options.eyes) result.eyesVariant = options.eyes;
  if (options.nose) result.noseVariant = options.nose;
  if (options.mouth) result.mouthVariant = options.mouth;

  return result;
}

// Main avatar style options
const mainStyleOptions = computed(() =>
  buildStyleOptions(currentOptions.value),
);

// Panel items based on active tab
const panelItems = computed(() => {
  const tab = tabs[activeTab.value].toLowerCase();

  if (tab === 'background') {
    return bgColors.map((color) => ({
      id: color,
      options: buildStyleOptions({
        ...currentOptions.value,
        backgroundColor: color,
      }),
      selected: currentOptions.value.backgroundColor === color,
    }));
  }

  const key = tab as keyof typeof variants;
  const variantList = variants[key] || [];

  return variantList.map((variant) => ({
    id: variant,
    options: buildStyleOptions({ ...currentOptions.value, [key]: variant }),
    selected: currentOptions.value[key] === variant,
  }));
});

// Handle item selection
function selectItem(id: string) {
  const tab = tabs[activeTab.value].toLowerCase();

  if (tab === 'background') {
    currentOptions.value.backgroundColor = id;
  } else {
    const key = tab as keyof typeof currentOptions.value;
    currentOptions.value[key] = currentOptions.value[key] === id ? '' : id;
  }
}

const features = [
  {
    icon: MousePointerClick,
    title: 'No Coding Required',
    description: 'Click to customize hair, eyes, accessories, and more.',
  },
  {
    icon: Palette,
    title: 'Endless Combinations',
    description: 'Mix and match colors and styles to create your unique look.',
  },
  {
    icon: Download,
    title: 'Download as PNG',
    description: 'Save your avatar and use it anywhere you like.',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-editor-gradient"></div>
      <div class="app-editor-dots"></div>
    </template>
    <UiContainer class="app-editor-container">
      <div class="app-editor-preview">
        <UiWindow title="DiceBear Editor">
          <!-- Main avatar preview -->
          <div
            class="app-editor-canvas"
            :style="{ backgroundColor: canvasBackground }"
          >
            <div
              class="app-editor-avatar-preview"
              :style="{ backgroundColor: `#${currentOptions.backgroundColor}` }"
            >
              <UiAvatar
                style-name="lorelei"
                :style-options="mainStyleOptions"
                alt="Avatar Preview"
              />
            </div>
          </div>

          <!-- Bottom panel with tabs and options -->
          <div class="app-editor-panel">
            <div class="app-editor-panel-tabs">
              <button
                v-for="(tab, index) in tabs"
                :key="tab"
                :class="[
                  'app-editor-panel-tab',
                  { active: index === activeTab },
                ]"
                @click="activeTab = index"
              >
                {{ tab }}
              </button>
            </div>
            <div class="app-editor-panel-grid">
              <button
                v-for="(item, index) in panelItems"
                :key="`${activeTab}-${item.id}`"
                :class="[
                  'app-editor-panel-avatar',
                  { selected: item.selected },
                ]"
                :style="{ animationDelay: `${index * 0.05}s` }"
                @click="selectItem(item.id)"
              >
                <UiAvatar
                  style-name="lorelei"
                  :style-options="item.options"
                  :alt="`Variant ${index + 1}`"
                />
              </button>
            </div>
          </div>
        </UiWindow>
      </div>

      <div class="app-editor-content">
        <UiHeadline class="app-editor-title-text"
          >Avatar Maker <strong>Without Code</strong></UiHeadline
        >
        <UiDescription class="app-editor-description">
          No developer? No problem! Our avatar maker lets anyone create custom
          profile pictures without writing a single line of code. Just pick,
          click, and download.
        </UiDescription>

        <div class="app-editor-features">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="app-editor-feature"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <UiIconBox size="md">
              <component :is="feature.icon" />
            </UiIconBox>
            <div class="app-editor-feature-text">
              <h4 class="app-editor-feature-title">{{ feature.title }}</h4>
              <p class="app-editor-feature-description">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="app-editor-actions">
          <Button
            as="a"
            href="https://editor.dicebear.com"
            target="_blank"
            rel="noopener"
            size="large"
            severity="contrast"
          >
            <Brush :size="20" />
            Open Editor
            <ArrowRight :size="20" />
          </Button>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-editor {
  &-gradient {
    background: radial-gradient(
      ellipse 60% 60% at 100% 50%,
      color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
      transparent
    );
  }

  &-dots {
    background-image: radial-gradient(
      circle,
      var(--vp-c-text-3) 1px,
      transparent 1px
    );
    background-size: 24px 24px;
    background-repeat: repeat !important;
    opacity: 0.12;
    mask-image: radial-gradient(ellipse 50% 50% at 0% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(
      ellipse 50% 50% at 0% 50%,
      black,
      transparent
    );
  }

  &-container {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 80px;
    align-items: center;
    opacity: 0;
    transform: translateY(40px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-preview {
    min-width: 0;
  }

  /* Canvas */
  &-canvas {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    min-height: 200px;
    transition: background-color var(--duration-mid) ease;
  }

  &-avatar-preview {
    width: 140px;
    height: 140px;
    background: #ffd5dc;
    border-radius: var(--vp-radius-xl);
    overflow: hidden;
    box-shadow: var(--vp-shadow-3);
    transition: background-color var(--duration-mid) ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* Bottom panel */
  &-panel {
    background: var(--vp-c-bg);
    border-top: 1px solid var(--vp-c-border);
    padding: 16px;

    &-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    &-tab {
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      color: var(--vp-c-text-2);
      white-space: nowrap;
      border-radius: var(--vp-radius-xs);
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all var(--duration-fast) ease;

      &:hover {
        color: var(--vp-c-text-1);
        background: var(--vp-c-bg-soft);
      }

      &.active {
        color: var(--vp-c-brand-1);
        background: var(--vp-c-brand-soft);
        font-weight: 600;
      }
    }

    &-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }

    &-avatar {
      aspect-ratio: 1;
      border-radius: var(--vp-radius-sm);
      overflow: hidden;
      opacity: 0;
      transform: scale(0.9);
      border: none;
      padding: 0;
      cursor: pointer;
      background: transparent;
      transition:
        transform var(--duration-fast) ease,
        box-shadow var(--duration-fast) ease;

      &:hover {
        transform: scale(1.05);
      }

      &.selected {
        box-shadow: 0 0 0 3px var(--vp-c-brand-1);

        &:hover {
          transform: scale(1);
        }
      }

      .visible & {
        animation: app-editor-avatar-pop 0.4s var(--ease-smooth) forwards;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  /* Content */
  &-content {
    min-width: 0;
  }

  &-description {
    margin: 0 0 36px 0;
    max-width: none;
  }

  &-features {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 36px;
  }

  &-feature {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    opacity: 0;
    transform: translateX(20px);

    .visible & {
      animation: app-editor-feature-slide 0.5s var(--ease-smooth) forwards;
    }

    &-text {
      min-width: 0;
    }

    &-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--vp-c-text-1);
      margin: 0 0 4px;
    }

    &-description {
      font-size: 14px;
      color: var(--vp-c-text-2);
      margin: 0;
      line-height: 1.5;
    }
  }

  &-actions {
    display: flex;
    gap: 16px;
  }
}

@keyframes app-editor-avatar-pop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes app-editor-feature-slide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1000px) {
  .app-editor {
    &-container {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    &-preview {
      order: 2;
    }

    &-content {
      order: 1;
    }
  }
}

@media (max-width: 640px) {
  .app-editor {
    &-panel-grid {
      grid-template-columns: repeat(5, 1fr);
    }

    &-panel-tabs {
      gap: 4px;
    }

    &-panel-tab {
      padding: 6px 10px;
      font-size: 12px;
    }
  }
}
</style>
