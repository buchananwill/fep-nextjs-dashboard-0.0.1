import { createContext } from 'react';
import { HueOption } from '../components/hue-selector';
import { LightnessOption } from '../components/lightness-selector';
import { HUE_OPTIONS, LIGHTNESS_OPTIONS } from '../components/color-context';

export interface SubjectColorCodingState {
  [key: string]: { hue: HueOption; lightness: LightnessOption };
}

export interface ModalColorSelect {
  setLessonText: (text: string) => void;
  openModal: () => void;
  hue: HueOption;
  setHue: (value: HueOption) => void;
  lightness: LightnessOption;
  setLightness: (value: LightnessOption) => void;
}

export interface SubjectColorCodingDispatchState {
  setSubjectColorCoding: (updatedState: SubjectColorCodingState) => void;
}

export const SubjectColorCoding = createContext<SubjectColorCodingState>({});

export const SubjectColorCodingDispatch =
  createContext<SubjectColorCodingDispatchState>({
    setSubjectColorCoding: () => null
  });

export const ModalColorSelectContext = createContext<ModalColorSelect>({
  setLessonText: (text) => null,
  openModal: () => null,
  hue: HUE_OPTIONS[0],
  setHue: (value) => null,
  lightness: LIGHTNESS_OPTIONS[0],
  setLightness: (value) => null
});
