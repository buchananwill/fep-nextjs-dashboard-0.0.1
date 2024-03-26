import { HueOption } from './hue-selector';
import { LightnessOption } from './lightness-selector';
import { createContext } from 'react';
import { DispatchStateAction } from 'react-day-picker/src/hooks/useControlledValue';
import { darken, lighten } from './lightness-functions';

export interface ColorState {
  hue: HueOption;
  setHue: (value: HueOption) => void;
  lightness: LightnessOption;
  setLightness: (value: LightnessOption) => void;
}

export const NullHue: HueOption = { name: 'Gray', id: 'gray' } as const;

export const HUE_OPTIONS: HueOption[] = [
  { name: 'Red', id: 'red' },
  { name: 'Orange', id: 'orange' },
  { name: 'Amber', id: 'amber' },
  { name: 'Yellow', id: 'yellow' },
  { name: 'Lime', id: 'lime' },
  { name: 'Green', id: 'green' },
  { name: 'Emerald', id: 'emerald' },
  { name: 'Teal', id: 'teal' },
  { name: 'Cyan', id: 'cyan' },
  { name: 'Sky', id: 'sky' }, // or 'lightblue'
  { name: 'Blue', id: 'blue' },
  { name: 'Indigo', id: 'indigo' },
  { name: 'Violet', id: 'violet' },
  { name: 'Purple', id: 'purple' },
  { name: 'Fuchsia', id: 'fuchsia' },
  { name: 'Pink', id: 'pink' },
  { name: 'Rose', id: 'rose' }
];
export const LIGHTNESS_OPTIONS: LightnessOption[] = [
  { name: 'Light', id: 200 },
  { name: 'Medium', id: 400 },
  { name: 'Dark', id: 600 }
];

export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
  cssHSLA: string;
}
export interface HslaColorState {
  base: HSLA;
  lighter: HSLA;
  darker: HSLA;
  current: HSLA;
}

export interface HslaColorStateDispatch {
  setHslaColorState: DispatchStateAction<HslaColorState>;
}
export const BASE_HSL: { [key: string]: HSLA } = {
  gray: { h: 220, s: 9, l: 46, a: 1, cssHSLA: 'hsl(220, 9%, 46%, 1)' },
  red: { h: 0, s: 84, l: 60, a: 1, cssHSLA: 'hsl(0, 84%, 60%, 1)' },
  orange: { h: 25, s: 95, l: 53, a: 1, cssHSLA: 'hsl(25, 95%, 53%, 1)' },
  amber: { h: 38, s: 92, l: 50, a: 1, cssHSLA: 'hsl(38, 92%, 50%, 1)' },
  yellow: { h: 45, s: 93, l: 47, a: 1, cssHSLA: 'hsl(45, 93%, 47%, 1)' },
  lime: { h: 84, s: 81, l: 44, a: 1, cssHSLA: 'hsl(84, 81%, 44%, 1)' },
  green: { h: 142, s: 71, l: 45, a: 1, cssHSLA: 'hsl(142, 71%, 45%, 1)' },
  emerald: { h: 160, s: 84, l: 39, a: 1, cssHSLA: 'hsl(160, 84%, 39%, 1)' },
  teal: { h: 173, s: 80, l: 40, a: 1, cssHSLA: 'hsl(173, 80%, 40%, 1)' },
  cyan: { h: 189, s: 94, l: 43, a: 1, cssHSLA: 'hsl(189, 94%, 43%, 1)' },
  sky: { h: 199, s: 89, l: 48, a: 1, cssHSLA: 'hsl(199, 89%, 48%, 1)' },
  blue: { h: 217, s: 86, l: 60, a: 1, cssHSLA: 'hsl(217, 86%, 60%, 1)' },
  indigo: { h: 239, s: 84, l: 67, a: 1, cssHSLA: 'hsl(239, 84%, 67%, 1)' },
  violet: { h: 258, s: 90, l: 66, a: 1, cssHSLA: 'hsl(258, 90%, 66%, 1)' },
  purple: { h: 271, s: 91, l: 65, a: 1, cssHSLA: 'hsl(271, 91%, 65%, 1)' },
  fuchsia: { h: 330, s: 81, l: 60, a: 1, cssHSLA: 'hsl(330, 81%, 60%, 1)' },
  pink: { h: 350, s: 89, l: 60, a: 1, cssHSLA: 'hsl(350, 89%, 60%, 1)' },
  rose: { h: 350, s: 89, l: 60, a: 1, cssHSLA: 'hsl(350, 89%, 60%, 1)' }
};

export const defaultColorState = {
  hue: NullHue,
  lightness: LIGHTNESS_OPTIONS[1]
};

export const ColorContext = createContext<ColorState>({
  hue: NullHue,
  setHue: () => null,
  lightness: LIGHTNESS_OPTIONS[0],
  setLightness: () => null
});

const defaultHslColorState: HslaColorState = {
  base: BASE_HSL['gray'],
  darker: darken(BASE_HSL['gray']),
  lighter: lighten(BASE_HSL['gray']),
  current: BASE_HSL['gray']
};

export const HslColorContext =
  createContext<HslaColorState>(defaultHslColorState);
export const HslColorDispatchContext = createContext<HslaColorStateDispatch>({
  setHslaColorState: () => {}
});
