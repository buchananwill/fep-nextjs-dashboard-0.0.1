import { createContext } from 'react';
import { ElectiveState } from './elective-reducers';

import { FilterType } from './elective-filter-reducers';

export const ElectiveContext = createContext<ElectiveState>({
  highlightedCourses: [],
  pinnedStudents: [],
  filterPending: false,
  filterType: FilterType.any,
  studentList: [],
  carouselId: 0,
  courseCarouselId: 0,
  uuid: '',
  electivePreferences: {},
  partyId: 0
});

export const ElectiveDispatchContext = createContext<Function>(() => {});
