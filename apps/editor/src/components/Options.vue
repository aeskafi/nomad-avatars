<script setup lang="ts">
import useMainStore from '@/stores/main';
import type { SelectedStyleOptions } from '@/types';
import { computed } from 'vue';
import Avatar from './Avatar.vue';
import Footer from './Footer.vue';
import { useDebounceFn } from '@vueuse/core';

const store = useMainStore();

const tabs = computed(() => {
  const result: Record<
    string,
    Array<{
      avatar: string;
      active?: boolean;
      options?: SelectedStyleOptions;
      onClick: () => void;
      onColorInput?: (value: string) => void;
    }>
  > = {};

  result['style'] = Object.keys(store.availableStyles).map((styleName) => ({
    avatar: store.availableStyles[styleName][0].avatar.toString(),
    active: store.selectedStyleName === styleName,
    onClick: () => changeStyleName(styleName),
  }));

  for (const key in store.selectedStyleCombinations) {
    result[key] = store.selectedStyleCombinations[key].map((combination) => ({
      avatar: combination.avatar.toString(),
      active: combination.active,
      options: combination.options,
      onClick: () => changeOptions(combination.options),
      onColorInput: combination.isCustomColor
        ? (value: string) =>
            changeOptionsWithOverride(combination.options, key, value)
        : undefined,
    }));
  }

  return result;
});

const selectedTabOptionName = computed(() => {
  return Object.keys(tabs.value)[parseInt(store.selectedTab)];
});

const customColorDefaultValue = computed({
  get: () => store.selectedStyleOptions[selectedTabOptionName.value],
  set: (value) =>
    tabs.value[selectedTabOptionName.value][0].onColorInput?.(value),
});

function changeStyleName(styleName: string) {
  store.selectedStyleName = styleName;
}

function changeOptions(options: SelectedStyleOptions) {
  store.selectedStyleOptions = options;
}

const changeOptionsWithOverride = useDebounceFn(
  function (options: SelectedStyleOptions, optionKey: string, value: string) {
    store.selectedStyleOptions = {
      ...options,
      [optionKey]: value,
    };
  },
  50,
  { maxWait: 50 },
);
</script>

<template>
  <div class="options">
    <Tabs v-model:value="store.selectedTab">
      <TabPanels>
        <TabPanel
          v-for="(key, i) in Object.keys(tabs)"
          :key="i"
          :value="i.toString()"
        >
          <div class="options-slide">
            <div class="options-grid">
              <button
                v-for="(combination, ci) in tabs[key]"
                :key="ci"
                :class="{
                  'options-avatar': true,
                  'options-avatar-active': combination.active,
                }"
                @click="combination.onClick"
              >
                <Avatar
                  :svg="combination.avatar"
                  class="options-avatar-component"
                />
                <label
                  v-if="combination.onColorInput"
                  class="options-avatar-wheel"
                >
                  <div class="options-avatar-wheel-picker">
                    <ColorPicker v-model="customColorDefaultValue">
                    </ColorPicker>
                  </div>
                </label>
              </button>
            </div>
            <Footer :tab="key" />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.options {
  &-slide {
    padding: var(--van-padding-md) var(--van-padding-sm);
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    gap: 20px;
    width: 100%;
  }

  &-avatar {
    position: relative;

    &-component {
      border-radius: 12px;
      overflow: hidden;
    }

    &::after {
      content: '';
      position: absolute;
      top: -6px;
      right: -6px;
      bottom: -6px;
      left: -6px;
      border-radius: 18px;
      border: 0 solid #1689cc;
      transition: border-width 0.12s ease-in-out;
      pointer-events: none;
    }

    &-active {
      &::after {
        border-width: 3px;
      }
    }

    &-wheel {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      cursor: pointer;

      &-picker {
        position: absolute;
        bottom: 0;
        right: 0;

        :global(input) {
          visibility: hidden;
        }
      }

      &::before {
        content: '';
        position: absolute;
        right: 2px;
        bottom: 2px;
        width: 28px;
        height: 28px;
        border: 2px solid #fff;
        border-radius: 50%;
        background: conic-gradient(
          red 0%,
          red 14.29%,
          orange 14.29%,
          orange 28.57%,
          yellow 28.57%,
          yellow 42.86%,
          green 42.86%,
          green 57.14%,
          blue 57.14%,
          blue 71.43%,
          indigo 71.43%,
          indigo 85.71%,
          violet 85.71%
        );
      }

      &::after {
        content: '';
        position: absolute;
        right: 11px;
        bottom: 11px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fff;
      }
    }

    @media (pointer: fine) {
      &:hover {
        &::after {
          border-width: 3px;
        }
      }
    }
  }
}
</style>
