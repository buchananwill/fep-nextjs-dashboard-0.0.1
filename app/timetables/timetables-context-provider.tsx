'use client';

import { ReactNode, useContext, useEffect, useReducer } from 'react';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { enableMapSet, produce } from 'immer';

import timetablesReducer, { TimetablesState } from './timetables-reducers';
import {
  SubjectColorCoding,
  SubjectColorCodingDispatch,
  SubjectColorCodingState
} from '../subject-color-coding/context';
import { LessonCycle } from '../api/state-types';
import { HUE_OPTIONS, LIGHTNESS_OPTIONS } from '../components/color-context';
import { HueOption } from '../components/hue-selector';
import { LightnessOption } from '../components/lightness-selector';

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

  const subjectColorCodingState = useContext(SubjectColorCoding);
  const { setSubjectColorCoding } = useContext(SubjectColorCodingDispatch);

  enableMapSet();

  return (
    <TimetablesContext.Provider value={timetablesState}>
      <TimetablesDispatchContext.Provider value={dispatch}>
        {children}
      </TimetablesDispatchContext.Provider>
    </TimetablesContext.Provider>
  );
}
