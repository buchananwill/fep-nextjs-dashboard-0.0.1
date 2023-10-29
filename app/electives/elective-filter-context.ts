import { createContext } from 'react';

import { ElectiveFilterState } from './elective-filter-reducers';

export const ElectiveFilterContext = createContext<ElectiveFilterState>({
  courseFilters: [],
  courseCarouselFilters: [],
  studentFilters: []
});

export const ElectiveFilterDispatchContext = createContext<Function>(() => {});
