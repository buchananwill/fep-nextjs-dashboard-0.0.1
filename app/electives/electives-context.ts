import { createContext } from 'react';
import { ElectivesState } from './elective-reducers';

export const ElectivesContext = createContext<ElectivesState>({
  carouselId: 0,
  courseCarouselId: 0,
  courseId: '',
  electivePreferences: {},
  partyId: 0
});

export const ElectivesDispatchContext = createContext<Function>(() => {});
