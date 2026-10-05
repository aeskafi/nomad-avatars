import { AvatarStyle, AvatarStyleMeta, ThemeOptions } from '@theme/types';
import { useData } from 'vitepress';
import { computed, Ref, unref } from 'vue';

export function useAvatarStyleList(): Ref<string[]> {
  const data = useData<ThemeOptions>();

  return computed(() => Object.keys(data.theme.value.avatarStyles));
}

export function useAvatarStyleFromOptions(
  avatarStyleName: string | Ref<string>,
): Ref<AvatarStyle | undefined> {
  const data = useData<ThemeOptions>();

  return computed(() => {
    const avatarStyleNameRaw = unref(avatarStyleName);

    return data.theme.value.avatarStyles[avatarStyleNameRaw];
  });
}

export function useAvatarStyleMeta(
  avatarStyleName: string | Ref<string>,
): Ref<AvatarStyleMeta | undefined> {
  const avatarStyle = useAvatarStyleFromOptions(avatarStyleName);

  return computed(() => {
    const avatarStyleRaw = unref(avatarStyle);

    return avatarStyleRaw?.meta;
  });
}
