import type { SelectedStyleOptions } from '@/types';
import { Avatar } from '@dicebear/core';
import getAvatarOptions from './getAvatarOptions';
import availableStyles from '@/config/styles';

export function createAvatar(
  styleName: string,
  options: SelectedStyleOptions,
): Avatar {
  return new Avatar(
    availableStyles[styleName].style,
    getAvatarOptions(styleName, options),
  );
}
