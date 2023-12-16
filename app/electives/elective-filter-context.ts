import { createContext } from 'react';

import { ElectiveFilterState } from './elective-filter-reducers';

export const ElectiveFilterContext = createContext<ElectiveFilterState>({
  courseFilters: [],
  courseCarouselFilters: [],
  filteredStudents: []
});

export const ElectiveFilterDispatchContext = createContext<Function>(() => {});
