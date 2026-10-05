import {
  ref,
  isRef,
  onMounted,
  onUnmounted,
  type Ref,
  type ComponentPublicInstance,
} from 'vue';

export interface UseVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useVisibility(
  target:
    | string
    | Ref<ComponentPublicInstance | Element | null | undefined>
    | (() => Element | null),
  options: UseVisibilityOptions = {},
): Ref<boolean> {
  const { threshold = 0.2, rootMargin = '0px', once = true } = options;
  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    let element: Element | null = null;

    if (typeof target === 'string') {
      element = document.querySelector(target);
    } else if (isRef(target)) {
      const val = target.value;

      if (val instanceof Element) {
        element = val;
      } else if (val && '$el' in val) {
        element = val.$el;
      }
    } else {
      element = target();
    }

    if (!element) {
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isVisible.value = true;

            if (once && observer) {
              observer.disconnect();
            }
          } else if (!once) {
            isVisible.value = false;
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return isVisible;
}
