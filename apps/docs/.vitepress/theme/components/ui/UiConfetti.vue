<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';

const canvas = ref<HTMLCanvasElement>();

const colors = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
];

onMounted(async () => {
  await nextTick();

  if (!canvas.value) return;

  const { default: confetti } = await import('canvas-confetti');
  const instance = confetti.create(canvas.value, {
    resize: true,
    disableForReducedMotion: true,
  });

  instance({
    particleCount: 50,
    angle: 60,
    spread: 55,
    startVelocity: 45,
    colors,
    origin: { x: -0.1, y: 0.8 },
  });

  instance({
    particleCount: 50,
    angle: 120,
    spread: 55,
    startVelocity: 45,
    colors,
    origin: { x: 1.1, y: 0.8 },
  });

  setTimeout(() => {
    instance({
      particleCount: 30,
      angle: 60,
      spread: 45,
      startVelocity: 35,
      colors,
      origin: { x: -0.1, y: 0.7 },
    });

    instance({
      particleCount: 30,
      angle: 120,
      spread: 45,
      startVelocity: 35,
      colors,
      origin: { x: 1.1, y: 0.7 },
    });
  }, 150);
});
</script>

<template>
  <canvas ref="canvas" class="ui-confetti"></canvas>
</template>

<style scoped>
.ui-confetti {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
</style>
