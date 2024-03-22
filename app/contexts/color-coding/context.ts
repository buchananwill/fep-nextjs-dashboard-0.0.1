import { createContext } from 'react';
import { HueOption } from '../../components/hue-selector';
import { LightnessOption } from '../../components/lightness-selector';
import {
  ColorState,
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../color/color-context';

export interface ColorCodingState {
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

export const ColorCoding = createContext<ColorCodingState>({});

export const ColorCodingDispatch = createContext<ColorCodingDispatchState>({
  setColorCoding: () => {}
});

export const ModalColorSelectContext = createContext<ModalColorSelect>({
  setModalText: (text) => {},
  stringKey: '',
  openModal: () => {},
  onCancel: () => {},
  onClose: () => {},
  onConfirm: () => {}
});
