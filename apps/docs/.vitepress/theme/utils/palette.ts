// Pastel backgrounds shared between the hero swarm and the use-case showcases.
// Stored without the leading `#` because they're passed as URL query values to
// the DiceBear avatar API (e.g. `?backgroundColor=ffe4e6`); CSS consumers
// prefix `#` themselves.
export const PALETTE = {
  rose: 'ffe4e6',
  amber: 'fef3c7',
  cyan: 'cffafe',
  blue: 'dbeafe',
  green: 'dcfce7',
  lime: 'ecfccb',
  peach: 'ffedd5',
  pink: 'ffe4f1',
} as const;

export type Pastel = (typeof PALETTE)[keyof typeof PALETTE];
