import { HueOption } from './hue-selector';
import { LightnessOption } from './lightness-selector';
import { createContext, useState } from 'react';

export interface ColorState {
  hue: HueOption;
  lightness: LightnessOption;
}

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
  { name: 'Medium', id: 500 },
  { name: 'Dark', id: 800 }
];

export const ColorContext = createContext<ColorState>({
  hue: HUE_OPTIONS[0],
  lightness: LIGHTNESS_OPTIONS[0]
});
