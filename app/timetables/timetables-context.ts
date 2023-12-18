import { createContext } from 'react';
import { TimetablesState } from './timetables-reducers';
import { FilterType } from '../electives/elective-filter-reducers';
import { LessonCycle } from '../api/state-types';

export const TimetablesContext = createContext<TimetablesState>(
  createInitialTimetablesContext()
);

export const TimetablesDispatchContext = createContext<Function>(() => {});

export function createInitialTimetablesContext(): TimetablesState {
  return {
    highlightedSubjects: new Set<string>(),
    highlightedSubjectsList: [],
    pinnedLessonCycles: new Set<string>(),
    filterPending: false,
    filterType: FilterType.any,
    lessonCycleMap: new Map<string, LessonCycle>(),
    cycleDayFocusId: -1,
    focusPeriodId: -1,
    periodIdToLessonCycleMap: new Map<number, Set<string>>(),
    lessonCycleId: '',
    scheduleId: NaN,
    updatePending: false,
    studentTimetables: new Map()
  };
}
