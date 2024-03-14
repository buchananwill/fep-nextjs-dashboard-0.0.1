'use client';

import { ReactNode, useReducer } from 'react';
import {
  ElectiveFilterContext,
  ElectiveFilterDispatchContext
} from './elective-filter-context';

import electiveFilterReducer, {
  ElectiveFilterState
} from './elective-filter-reducers';

interface Props {
  children: ReactNode;
}

export default function ElectiveFilterContextProvider({ children }: Props) {
  const initialElectiveFilterState: ElectiveFilterState = {
    courseFilters: [],
    courseCarouselFilters: [],
    filteredStudents: []
  };

  const [electiveFilterState, dispatch] = useReducer(
    electiveFilterReducer,
    initialElectiveFilterState
  );

  return (
    <ElectiveFilterContext.Provider value={electiveFilterState}>
      <ElectiveFilterDispatchContext.Provider value={dispatch}>
        {children}
      </ElectiveFilterDispatchContext.Provider>
    </ElectiveFilterContext.Provider>
  );
}
