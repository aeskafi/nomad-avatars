import { computed, shallowRef, watch, type ComputedRef } from 'vue';
import { storeToRefs } from 'pinia';
import type { StyleDefinition } from '@dicebear/core';
import type { AvatarUniqueCount } from '@theme/types';
import { computeCount } from '@theme/utils/avatar/combinationCount';
import { narrowDefinition } from '@theme/utils/avatar/narrowDefinition';
import { loadAvatarStyleDefinition } from '@theme/utils/avatar/style';
import useStore from '@theme/stores/playground';

/**
 * Reactively reports the number of distinct avatars reachable with the
 * playground's currently selected style and option restrictions. Returns
 * `undefined` until the style's raw definition is loaded.
 */
export function useCombinationCount(): ComputedRef<
  AvatarUniqueCount | undefined
> {
  const store = useStore();
  const { avatarStyleName, avatarStyleOptionsWithoutDefaults } =
    storeToRefs(store);

  const definition = shallowRef<{ name: string; def: StyleDefinition } | null>(
    null,
  );

  watch(
    avatarStyleName,
    async (name) => {
      try {
        const def = await loadAvatarStyleDefinition(name);

        if (avatarStyleName.value === name) {
          definition.value = { name, def };
        }
      } catch {
        definition.value = null;
      }
    },
    { immediate: true },
  );

  return computed<AvatarUniqueCount | undefined>(() => {
    const current = definition.value;

    if (!current || current.name !== avatarStyleName.value) {
      return undefined;
    }

    const narrowed = narrowDefinition(
      current.def,
      avatarStyleOptionsWithoutDefaults.value,
    );

    return computeCount(narrowed);
  });
}
