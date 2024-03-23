import { createContext } from 'react';
import { HueOption } from '../components/hue-selector';
import { LightnessOption } from '../components/lightness-selector';
import { HUE_OPTIONS, LIGHTNESS_OPTIONS } from '../components/color-context';
import { ColorState, NullHue } from '../contexts/color/color-context';
import { ColorCodingState } from '../contexts/color-coding/context';

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
