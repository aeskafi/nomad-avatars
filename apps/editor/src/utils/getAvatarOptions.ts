import type { SelectedStyleOptions } from '@/types';
import styleCollection from '@/config/styles';

export default function getAvatarOptions(
  styleName: string,
  options: SelectedStyleOptions,
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    size: 512,
  };

  const configStyleOptions = styleCollection[styleName].options;

  for (const key in options) {
    if (false === Object.prototype.hasOwnProperty.call(options, key)) {
      continue;
    }

    const avatarOption = options[key];
    const styleOption = configStyleOptions[key];

    if (!styleOption) {
      continue;
    }

    if (
      styleOption.isColor &&
      (!avatarOption || avatarOption === 'transparent')
    ) {
      continue;
    }

    const value = styleOption.isColor ? `#${avatarOption}` : avatarOption;

    if (styleOption.isArray) {
      result[key] = value ? [value] : [];
    } else {
      result[key] = value;
    }

    if (styleOption.hasProbability) {
      const componentName = key.replace(/Variant$/, '');
      result[`${componentName}Probability`] = avatarOption ? 100 : 0;
    }
  }

  return result;
}
