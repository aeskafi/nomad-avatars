import { ref, computed } from 'vue';
import useStore from '../stores/playground';

export function usePlaygroundDialog(seed: () => string) {
  const store = useStore();

  const open = ref(false);
  const confettiKey = ref(0);

  const options = computed(() => ({
    ...store.avatarStyleOptionsWithoutDefaults,
    seed: seed(),
  }));

  function showDialog() {
    confettiKey.value++;
    open.value = true;
  }

  return {
    store,
    open,
    confettiKey,
    options,
    showDialog,
  };
}
