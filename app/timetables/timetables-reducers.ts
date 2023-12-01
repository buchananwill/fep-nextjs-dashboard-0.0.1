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
  lessonCycleId: number;
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
  lessonCycleId: number;
}

interface SetHighlightedSubjects {
  type: 'setHighlightedSubjects';
  subject: string;
}

interface SetLessonCycles {
  type: 'setLessonCycles';
  lessonCycles: LessonCycle[];
}

export type TimetablesStateActions =
  | SetPeriod
  | SetActive
  | SetFocusPeriod
  | FocusLessonCycle
  | SetFilterType
  | SetFilterPending
  | SetPinnedLessonCycle
  | SetHighlightedSubjects
  | SetLessonCycles;

export type TimetablesState = {
  highlightedSubjects: Set<string>;
  pinnedLessonCycles: Set<number>;
  filterPending: boolean;
  filterType: FilterType;
  lessonCycleMap: Map<number, LessonCycle>;
  periodIdToLessonCycleMap: Map<number, Set<LessonCycle>>;
  cycleDayFocusId: number;
  focusPeriodId: number;
  lessonCycleId: number;
  scheduleId: number;
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
        draftState.focusPeriodId = matchOldId ? NaN : periodId;
        draftState.filterPending = true;
      });
    }

    case 'setFocusLessonCycle': {
      const { lessonCycleId } = action;

      const isFocus = lessonCycleId == timetablesState.lessonCycleId;

      return produce(timetablesState, (draftState) => {
        draftState.lessonCycleId = isFocus ? -1 : lessonCycleId;
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
      const { lessonCycleId } = action;
      const { pinnedLessonCycles, lessonCycleMap } = timetablesState;

      const currentlyPinned =
        pinnedLessonCycles && pinnedLessonCycles.has(lessonCycleId);

      return produce(timetablesState, (updatedState) => {
        if (currentlyPinned) {
          updatedState.pinnedLessonCycles.delete(lessonCycleId);
        } else {
          updatedState.pinnedLessonCycles.add(lessonCycleId);
        }
      });
    }
    case 'setHighlightedSubjects': {
      const { subject } = action;
      const { highlightedSubjects } = timetablesState;
      const currentlyHighlighted =
        highlightedSubjects && highlightedSubjects.has(subject);

      return produce(timetablesState, (updatedState) => {
        if (currentlyHighlighted) {
          updatedState.highlightedSubjects.delete(subject);
        } else {
          updatedState.highlightedSubjects.add(subject);
        }
      });
    }

    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}
