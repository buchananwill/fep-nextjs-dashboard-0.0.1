import { createContext } from 'react';

import { ElectiveFilterState } from './elective-filter-reducers';

export const ElectivesFilterContext = createContext<ElectiveFilterState>({
  courseFilters: [],
  courseCarouselFilters: [],
  studentFilters: []
});

export const ElectivesFilterDispatchContext = createContext<Function>(() => {});
