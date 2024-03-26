'use client';

import { ReactNode, useContext, useEffect, useReducer } from 'react';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { enableMapSet, produce } from 'immer';

import timetablesReducer, { TimetablesState } from './timetables-reducers';
import {
  ColorCoding,
  ColorCodingDispatch,
  SubjectColorCodingState
} from '../contexts/color/subject-color-coding-context';
import { LessonCycle } from '../api/state-types';
import {
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../components/color/color-context';
import { HueOption } from '../components/color/hue-selector';
import { LightnessOption } from '../components/color/lightness-selector';

interface Props {
  children: ReactNode;
  initialState: TimetablesState;
}

export default function TimetablesContextProvider({
  children,
  initialState
}: Props) {
  const [timetablesState, dispatch] = useReducer(
    timetablesReducer,
    initialState
  );

  const subjectColorCodingState = useContext(ColorCoding);
  const { setSubjectColorCoding } = useContext(ColorCodingDispatch);

  enableMapSet();

  return (
    <TimetablesContext.Provider value={timetablesState}>
      <TimetablesDispatchContext.Provider value={dispatch}>
        {children}
      </TimetablesDispatchContext.Provider>
    </TimetablesContext.Provider>
  );
}
