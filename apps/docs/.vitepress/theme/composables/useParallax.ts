import { watch, onMounted, onUnmounted, type Ref } from 'vue';

const LERP_FACTOR = 0.08;
const INITIAL_POSITION = 0.5;

export function useParallax(isVisible: Ref<boolean>) {
  let containerEl: HTMLElement | null = null;
  let targetMouseX = INITIAL_POSITION;
  let targetMouseY = INITIAL_POSITION;
  let currentX = INITIAL_POSITION;
  let currentY = INITIAL_POSITION;
  let animationFrameId: number | null = null;

  function setContainer(el: HTMLElement) {
    containerEl = el;
  }

  function handleMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / rect.width;
    targetMouseY = (e.clientY - rect.top) / rect.height;
  }

  function animate() {
    if (!isVisible.value) {
      animationFrameId = null;

      return;
    }

    currentX += (targetMouseX - currentX) * LERP_FACTOR;
    currentY += (targetMouseY - currentY) * LERP_FACTOR;

    if (containerEl) {
      containerEl.style.setProperty('--parallax-x', String(currentX));
      containerEl.style.setProperty('--parallax-y', String(currentY));
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  function start() {
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  watch(isVisible, (visible) => {
    if (visible) {
      start();
    }
  });

  onMounted(() => {
    if (isVisible.value) {
      start();
    }
  });

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return { setContainer, handleMouseMove };
}
