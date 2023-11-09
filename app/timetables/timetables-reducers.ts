import { produce } from 'immer';

import { FilterType } from '../electives/elective-filter-reducers';
import { LessonCycle } from '../api/state-types';

interface SetPeriod {
  type: 'setPeriod';
  periodId: number;
  lessonCycleId: number;
}

interface SetActive {
  type: 'setActive';
  studentId: number;
  preferencePosition: number;
}

interface SetFocusPeriod {
  type: 'setFocusPeriod';
  periodId: number;
}

interface FocusLessonCycle {
  type: 'setFocusLessonCycle';
  studentId: number;
}

interface SetFilterType {
  type: 'setFilterType';
  filterType: FilterType;
}

interface SetFilterPending {
  type: 'setFilterPending';
  pending: boolean;
}

interface SetPinnedLessonCycle {
  type: 'setPinnedLessonCycle';
  id: number;
}

interface SetHighlightedCourses {
  type: 'setHighlightedCourses';
  id: string;
}

export type TimetablesStateActions =
  | SetPeriod
  | SetActive
  | SetFocusPeriod
  | FocusLessonCycle
  | SetFilterType
  | SetFilterPending
  | SetPinnedLessonCycle
  | SetHighlightedCourses;

export type TimetablesState = {
  highlightedCourses: Set<string>;
  pinnedLessonCycles: Set<number>;
  filterPending: boolean;
  filterType: FilterType;
  lessonCycleMap: Map<number, LessonCycle>;
  periodIdToLessonCycleMap: Map<number, Set<LessonCycle>>;
  cycleDayFocusId: number;
  focusPeriodId: number;
  partyId: number;
};

export default function timetablesReducer(
  timetablesState: TimetablesState,
  action: TimetablesStateActions
) {
  switch (action.type) {
    case 'setPeriod': {
      const { periodId } = action;

      return produce(timetablesState, (draftUpdate) => {
        null;
      });
    }
    case 'setActive': {
      const { studentId, preferencePosition } = action;

      return produce(timetablesState, (draftElectiveState) => {
        null;
      });
    }

    case 'setFocusPeriod': {
      const { periodId } = action;
      const { focusPeriodId: oldId } = timetablesState;

      const matchOldId = periodId == oldId;

      return produce(timetablesState, (draftState) => {
        draftState.focusPeriodId = matchOldId ? -1 : periodId;
        draftState.filterPending = true;
      });
    }

    case 'setFocusLessonCycle': {
      const { studentId } = action;

      return produce(timetablesState, (draftState) => {
        draftState.partyId = studentId;
      });
    }

    case 'setFilterType': {
      const { filterType } = action;

      const updatedType =
        filterType == FilterType.all ? FilterType.any : FilterType.all;
      return produce(timetablesState, (draftState) => {
        draftState.filterType = updatedType;
        draftState.filterPending = true;
      });
    }
    case 'setFilterPending': {
      const { pending } = action;
      return produce(timetablesState, (updatedState) => {
        updatedState.filterPending = pending;
      });
    }

    case 'setPinnedLessonCycle': {
      const { id } = action;
      const { pinnedLessonCycles, lessonCycleMap } = timetablesState;

      const currentlyPinned = pinnedLessonCycles && pinnedLessonCycles.has(id);

      return produce(timetablesState, (updatedState) => {
        if (currentlyPinned) {
          updatedState.pinnedLessonCycles.delete(id);
        } else {
          updatedState.pinnedLessonCycles.add(id);
        }
      });
    }
    case 'setHighlightedCourses': {
      const { id } = action;
      const { highlightedCourses } = timetablesState;
      const currentlyHighlighted =
        highlightedCourses && highlightedCourses.has(id);

      return produce(timetablesState, (updatedState) => {
        if (currentlyHighlighted) {
          updatedState.highlightedCourses.delete(id);
        } else {
          updatedState.highlightedCourses.add(id);
        }
      });
    }

    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}
