import { createContext } from 'react';
import { ElectiveState } from './elective-reducers';

import { FilterType } from './elective-filter-reducers';
import { ElectiveDTO, StudentDTO } from '../api/dto-interfaces';

export const ElectiveContext = createContext<ElectiveState>({
  highlightedCourses: [],
  pinnedStudents: new Set<number>(),
  filterPending: false,
  filterType: FilterType.any,
  studentMap: new Map<number, StudentDTO>(),
  carouselOptionId: 0,
  electiveDtoMap: [],
  electivePreferences: new Map(),
  userRoleId: 0
});

export const ElectiveDispatchContext = createContext<Function>(() => {});
