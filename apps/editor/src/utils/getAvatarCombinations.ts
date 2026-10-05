import availableStyles from '@/config/styles';
import type {
  SelectedStyleCombination,
  SelectedStyleCombinations,
  SelectedStyleOptions,
} from '@/types';
import { createAvatar } from './createAvatar';

export default function getAvatarCombinations(
  styleName: string,
  selectedStyleOptions: SelectedStyleOptions,
): SelectedStyleCombinations {
  const combinations: SelectedStyleCombinations = {};

  const currentAvatar = createAvatar(
    styleName,
    selectedStyleOptions,
  ).toString();

  const configStyleOptions = availableStyles[styleName].options;

  for (const key in configStyleOptions) {
    if (
      false === Object.prototype.hasOwnProperty.call(configStyleOptions, key)
    ) {
      continue;
    }

    combinations[key] = [];

    const styleOption = configStyleOptions[key];
    const avatarOption = selectedStyleOptions[key];

    let activeItem: SelectedStyleCombination | null = null;

    for (const value of styleOption.values) {
      const options = {
        ...selectedStyleOptions,
        [key]: value,
      };

      const avatar = createAvatar(styleName, options);
      const active = avatarOption === value;
      const isIdentical = currentAvatar === avatar.toString();

      if (!isIdentical || active) {
        const item: SelectedStyleCombination = {
          active: avatarOption === value,
          avatar,
          options,
        };

        if (item.active) {
          activeItem = item;
        }

        combinations[key].push(item);
      }
    }

    if (styleOption.isColor) {
      const options = {
        ...selectedStyleOptions,
        [key]: avatarOption,
      };

      combinations[key].unshift({
        active: !activeItem,
        isCustomColor: true,
        avatar: createAvatar(styleName, options),
        options,
      });
    }
  }

  return combinations;
}
