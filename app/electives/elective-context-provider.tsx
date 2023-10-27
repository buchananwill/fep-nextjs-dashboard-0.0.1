'use client';

import { ReactNode, useReducer } from 'react';
import {
  ElectivesContext,
  ElectivesDispatchContext
} from './electives-context';
import { ElectivePreference } from './elective-subscriber-accordion';

import electivePreferencesReducer, {
  createdElectivePreferenceRecords
} from './elective-reducers';

interface Props {
  // lessonCycleFocus: ElectiveDTO;
  // studentFocus: number;
  // studentList: Student[];
  electivePreferenceList: ElectivePreference[];
  // electiveAvailability: ElectiveAvailability;
  children: ReactNode;
}

export default function ElectivesContextProvider({
  electivePreferenceList,
  children
}: Props) {
  const initialPreferenceState = createdElectivePreferenceRecords(
    electivePreferenceList
  );

  const [electivePreferences, dispatch] = useReducer(
    electivePreferencesReducer,
    initialPreferenceState
  );

  return (
    <ElectivesContext.Provider value={electivePreferences}>
      <ElectivesDispatchContext.Provider value={dispatch}>
        {children}
      </ElectivesDispatchContext.Provider>
    </ElectivesContext.Provider>
  );
}
