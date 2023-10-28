'use client';

import { ReactNode, useReducer } from 'react';
import {
  ElectivesFilterContext,
  ElectivesFilterDispatchContext
} from './electives-filter-context';

import electiveFilterReducer, {
  ElectiveFilterState
} from './elective-filter-reducers';
import { Student } from '../tables/student-table';

interface Props {
  children: ReactNode;
}

export default function ElectivesFilterContextProvider({ children }: Props) {
  const initialElectiveFilterState: ElectiveFilterState = {
    courseFilters: [],
    courseCarouselFilters: [],
    studentFilters: []
  };

  const [electiveFilterState, dispatch] = useReducer(
    electiveFilterReducer,
    initialElectiveFilterState
  );

  return (
    <ElectivesFilterContext.Provider value={electiveFilterState}>
      <ElectivesFilterDispatchContext.Provider value={dispatch}>
        {children}
      </ElectivesFilterDispatchContext.Provider>
    </ElectivesFilterContext.Provider>
  );
}
