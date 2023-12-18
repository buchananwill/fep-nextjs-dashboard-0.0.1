import { produce } from 'immer';

import { FilterType } from '../electives/elective-filter-reducers';
import { LessonCycle } from '../api/state-types';
import { ca, hi } from 'date-fns/locale';
import { LessonEnrollmentDTO } from '../api/dto-interfaces';

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

interface SetFocusLessonCycle {
  type: 'setFocusLessonCycle';
  lessonCycleId: string;
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
  lessonCycleId: string;
}

interface ToggleHighlightedSubject {
  type: 'toggleHighlightedSubject';
  subject: string;
}

interface SetHighlightedSubjects {
  type: 'setHighlightedSubjects';
  subjects: string[];
}

interface UpdateLessonCycles {
  type: 'updateLessonCycles';
  lessonCycles: LessonCycle[];
}

interface SetUpdatePending {
  type: 'setUpdatePending';
  value: boolean;
}

interface SetStudentTimetable {
  type: 'setStudentTimetable';
  id: number;
  timetable: LessonEnrollmentDTO[];
}

interface SetStudent {
  type: 'setStudent';
  id: number;
}

export type TimetablesStateActions =
  | SetPeriod
  | SetActive
  | SetFocusPeriod
  | SetFocusLessonCycle
  | SetFilterType
  | SetFilterPending
  | SetPinnedLessonCycle
  | ToggleHighlightedSubject
  | SetHighlightedSubjects
  | UpdateLessonCycles
  | SetUpdatePending
  | SetStudentTimetable
  | SetStudent;

export type TimetablesState = {
  highlightedSubjects: Set<string>;
  highlightedSubjectsList: string[];
  pinnedLessonCycles: Set<string>;
  filterPending: boolean;
  filterType: FilterType;
  lessonCycleMap: Map<string, LessonCycle>;
  periodIdToLessonCycleMap: Map<number, Set<string>>;
  cycleDayFocusId: number;
  focusPeriodId: number;
  lessonCycleId: string;
  scheduleId: number;
  updatePending: boolean;
  studentTimetables: Map<number, LessonEnrollmentDTO[]>;
  studentId: number;
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
        draftState.lessonCycleId = isFocus ? '' : lessonCycleId;
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
    case 'toggleHighlightedSubject': {
      const { subject } = action;
      const { highlightedSubjects } = timetablesState;
      const currentlyHighlighted =
        highlightedSubjects && highlightedSubjects.has(subject);

      return produce(timetablesState, (updatedState) => {
        const highlightedSubjectsUpdate = updatedState.highlightedSubjects;
        if (currentlyHighlighted) {
          highlightedSubjectsUpdate.delete(subject);
          updatedState.highlightedSubjectsList = [...highlightedSubjectsUpdate];
        } else {
          highlightedSubjectsUpdate.add(subject);
          updatedState.highlightedSubjectsList.push(subject);
        }
      });
    }
    case 'setHighlightedSubjects': {
      const { subjects } = action;

      return produce(timetablesState, (updatedStated) => {
        updatedStated.highlightedSubjects.clear();
        subjects?.forEach((subject) =>
          updatedStated.highlightedSubjects.add(subject)
        );
        updatedStated.highlightedSubjectsList = subjects;
      });
    }
    case 'setUpdatePending': {
      const { value } = action;
      return produce(timetablesState, (updatedState) => {
        updatedState.updatePending = value;
      });
    }

    case 'updateLessonCycles': {
      const { lessonCycles } = action;

      const { lessonCycleMap, periodIdToLessonCycleMap } = timetablesState;

      const removeLessonsFromPeriodsMap = new Map<number, Set<string>>();
      const addLessonsToPeriodsMap = new Map<number, Set<string>>();

      for (let key of periodIdToLessonCycleMap.keys()) {
        removeLessonsFromPeriodsMap.set(key, new Set());
        addLessonsToPeriodsMap.set(key, new Set());
      }
      for (let lessonCycleFromUpdate of lessonCycles) {
        const lessonCycleFromState = lessonCycleMap.get(
          lessonCycleFromUpdate.id
        );
        if (lessonCycleFromState) {
          // Find the periods that no longer have this lesson cycle.
          for (let key of lessonCycleFromState.periodVenueAssignments.keys()) {
            if (!lessonCycleFromUpdate.periodVenueAssignments.has(key))
              removeLessonsFromPeriodsMap
                .get(key)
                ?.add(lessonCycleFromState.id);
          }
          // Find the periods that have gained a lesson cycle.
          for (let key of lessonCycleFromUpdate.periodVenueAssignments.keys()) {
            if (!lessonCycleFromState.periodVenueAssignments.has(key))
              addLessonsToPeriodsMap.get(key)?.add(lessonCycleFromUpdate.id);
          }
        }
      }

      return produce(timetablesState, (updatedState) => {
        const { lessonCycleMap, periodIdToLessonCycleMap } = updatedState;
        // Update the Lesson Cycles
        for (let incomingLessonCycle of lessonCycles) {
          const outgoingLessonCycle = lessonCycleMap.get(
            incomingLessonCycle.id
          );
          if (outgoingLessonCycle)
            outgoingLessonCycle.periodVenueAssignments =
              incomingLessonCycle.periodVenueAssignments;
        }
        // Remove the old period assignments
        for (let periodId of removeLessonsFromPeriodsMap.keys()) {
          const outgoingPeriodLessonCycleSet =
            periodIdToLessonCycleMap.get(periodId);
          if (outgoingPeriodLessonCycleSet) {
            const removeTheseIds = removeLessonsFromPeriodsMap.get(periodId);
            removeTheseIds &&
              removeTheseIds.forEach((value) =>
                outgoingPeriodLessonCycleSet.delete(value)
              );
          }
        }
        // Add the new period assignments
        for (let periodId of addLessonsToPeriodsMap.keys()) {
          const outgoingPeriodLessonCycleSet =
            periodIdToLessonCycleMap.get(periodId);
          if (outgoingPeriodLessonCycleSet) {
            const addTheseIds = addLessonsToPeriodsMap.get(periodId);
            addTheseIds &&
              addTheseIds.forEach((value) =>
                outgoingPeriodLessonCycleSet.add(value)
              );
          }
        }
      });
    }
    case 'setStudentTimetable': {
      const { id, timetable } = action;
      return produce(timetablesState, (updatedState) => {
        updatedState.studentTimetables.set(id, timetable);
      });
    }
    case 'setStudent': {
      const { id } = action;
      return produce(timetablesState, (draft) => {
        draft.studentId = id;
      });
    }

    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}
