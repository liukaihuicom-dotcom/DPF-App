import type { ThemePalette } from '@/src/theme/colors';

import type { AppTextTone } from './Typography';

type QuoteChangeVisual = {
  color: string;
  tone: AppTextTone;
};

export function getQuoteChangeVisual(changePercent: number, palette: ThemePalette): QuoteChangeVisual {
  if (changePercent > 0) {
    return { color: palette.down, tone: 'down' };
  }

  if (changePercent < 0) {
    return { color: palette.up, tone: 'up' };
  }

  return { color: palette.textMuted, tone: 'muted' };
}
