'use client';

import { ReactNode, useReducer } from 'react';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';

import timetablesReducer, { TimetablesState } from './timetables-reducers';

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

  return (
    <TimetablesContext.Provider value={timetablesState}>
      <TimetablesDispatchContext.Provider value={dispatch}>
        {children}
      </TimetablesDispatchContext.Provider>
    </TimetablesContext.Provider>
  );
}
