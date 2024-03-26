import { createContext } from 'react';

import { ColorState } from '../../generic/components/color/color-context';
import { ColorCodingState } from '../../generic/components/color/color-coding-context';
import { HueOption } from '../../generic/components/color/hue-selector';
import { LightnessOption } from '../../generic/components/color/lightness-selector';

export interface SubjectColorCodingState {
  [key: string]: { hue: HueOption; lightness: LightnessOption };
}

export interface ModalColorSelect {
  setModalText: (text: string) => void;
  stringKey: string;
  openModal: () => void;
  onCancel: () => void;
  onConfirm: (state: ColorState) => void;
  onClose: () => void;
}

export interface ColorCodingDispatchState {
  setColorCoding: (updatedState: ColorCodingState) => void;
}

export const ColorCoding = createContext<SubjectColorCodingState>({});

export const ColorCodingDispatch = createContext<ColorCodingDispatchState>({
  setColorCoding: () => null
});

export const ModalColorSelectContext = createContext<ModalColorSelect>({
  setModalText: (text) => {},
  stringKey: '',
  openModal: () => {},
  onCancel: () => {},
  onClose: () => {},
  onConfirm: () => {}
});