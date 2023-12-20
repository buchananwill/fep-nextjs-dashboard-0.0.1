import { ColorState } from '../components/color-context';
import { createContext } from 'react';
import { HueOption } from '../components/hue-selector';
import { LightnessOption } from '../components/lightness-selector';

export interface SubjectColorCodingState {
  [key: string]: { hue: HueOption; lightness: LightnessOption };
}

export interface SubjectColorCodingDispatchState {
  setSubjectColorCoding: (updatedState: SubjectColorCodingState) => void;
}

export const SubjectColorCoding = createContext<SubjectColorCodingState>({});

export const SubjectColorCodingDispatch =
  createContext<SubjectColorCodingDispatchState>(() => null);
