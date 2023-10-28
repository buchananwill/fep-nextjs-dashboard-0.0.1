import { createContext } from 'react';
import { ElectiveState } from './elective-reducers';

export const ElectivesContext = createContext<ElectiveState>({
  courseFilters: [],
  courseCarouselFilters: [],
  pinnedStudents: [],
  carouselId: 0,
  courseCarouselId: 0,
  courseId: '',
  electivePreferences: {},
  partyId: 0
});

export const ElectivesDispatchContext = createContext<Function>(() => {});
