import { LessonCycle } from '../api/state-types';
import { TimetablesState } from './timetables-reducers';
import { FilterType } from '../electives/elective-filter-reducers';

export function buildTimetablesState(
  lessonCycleMap: Map<number, LessonCycle>,
  periodToLessonCycleMap: Map<number, Set<LessonCycle>>
): TimetablesState {
  return {
    highlightedSubjects: new Set<string>(),
    pinnedLessonCycles: new Set<number>(),
    filterPending: false,
    filterType: FilterType.any,
    lessonCycleMap: lessonCycleMap,
    cycleDayFocusId: -1,
    focusPeriodId: -1,
    periodIdToLessonCycleMap: periodToLessonCycleMap,
    lessonCycleId: -1
  };
}