<script setup lang="ts">
defineProps<{
  divider?: boolean;
  center?: boolean;
  surface?: 'base' | 'alt';
}>();
</script>

<template>
  <section
    class="ui-section"
    :class="{
      'ui-section-has-divider': divider,
      'ui-section-text-center': center,
      'ui-section-surface-alt': surface === 'alt',
    }"
  >
    <div v-if="$slots.background" class="ui-section-bg">
      <slot name="background" />
    </div>
    <div class="ui-section-foreground">
      <slot />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.ui-section {
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  /* Subtle dotted-grid texture, shared with the hero and demo frames, so every
     landing section reads as part of the same system. Sits
     behind the per-section gradient glows (#background slot) and the content. */
  background-image: radial-gradient(
    color-mix(in srgb, var(--vp-c-divider) 55%, transparent) 1px,
    transparent 1px
  );
  background-size: 24px 24px;

  &-has-divider::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(80%, 600px);
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--vp-c-border),
      transparent
    );
  }

  &-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  &-text-center {
    text-align: center;
  }

  &-surface-alt {
    background: var(--vp-c-bg-alt);
  }

  &-foreground {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 640px) {
    padding: 80px 0;

    &-no-padding {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>

<style>
.ui-section-bg > * {
  position: absolute;
  inset: 0;
}
</style>
