import { LessonCycle } from '../api/state-types';
import { TimetablesState } from './timetables-reducers';
import { FilterType } from '../electives/elective-filter-reducers';
import { LessonCycleDTO, TabularDTO } from '../api/dto-interfaces';
import { PeriodDTO } from '../api/dtos/PeriodDTOSchema';

export function buildTimetablesState(
  allPeriodsInCycle: TabularDTO<string, PeriodDTO>,
  allLessonCycles: LessonCycleDTO[],
  scheduleId: number
): { initialState: TimetablesState; lessonCycleArray: LessonCycle[] } {
  const lessonCycleMap = new Map<string, LessonCycle>();

  const lessonCycleArray: LessonCycle[] = [];

  allLessonCycles.forEach((lessonCycleDTO) => {
    const stateObject = convertDtoToState(lessonCycleDTO);
    lessonCycleMap.set(stateObject.id, stateObject);
    lessonCycleArray.push(stateObject);
  });

  const periodToLessonCycleMap = new Map<number, Set<string>>();

  // Work through the periods and add cycles with matching lessons.
  allPeriodsInCycle.cellDataAndMetaData.forEach(({ cellData: { id } }) => {
    if (id) {
      // const stringOfId = id.toString();
      const setOfLessonCycles = new Set<string>();
      lessonCycleArray.forEach((lessonCycle) => {
        if (lessonCycle.periodVenueAssignments.has(id)) {
          const retrievedCycle = lessonCycleMap.get(lessonCycle.id);
          if (retrievedCycle) setOfLessonCycles.add(retrievedCycle.id);
        }
      });
      periodToLessonCycleMap.set(id, setOfLessonCycles);
    }
  });

  const initialState = {
    highlightedSubjects: new Set<string>(),
    highlightedSubjectsList: [],
    pinnedLessonCycles: new Set<string>(),
    filterPending: false,
    filterType: FilterType.any,
    lessonCycleMap: lessonCycleMap,
    cycleDayFocusId: -1,
    focusPeriodId: -1,
    periodIdToLessonCycleMap: periodToLessonCycleMap,
    lessonCycleId: '',
    scheduleId: scheduleId,
    updatePending: false,
    studentTimetables: new Map(),
    studentId: NaN
  };

  return { initialState, lessonCycleArray };
}
export function convertDtoToState({
  id,
  enrolledStudentIds,
  assignedTeacherIds,
  periodVenueAssignments,
  requiredNumberOfPeriods,
  name,
  subject
}: LessonCycleDTO): LessonCycle {
  const enrolledStudentIdSet = new Set<number>();
  enrolledStudentIds.forEach((id) => enrolledStudentIdSet.add(id));
  const assignedTeacherIdSet = new Set<number>();
  assignedTeacherIds.forEach((id) => assignedTeacherIdSet.add(id));
  const periodVenueAssignmentMap = new Map<number, string>();
  for (let periodVenueAssignmentsKey in periodVenueAssignments) {
    const keyAsNumber = parseInt(periodVenueAssignmentsKey);
    periodVenueAssignmentMap.set(
      keyAsNumber,
      periodVenueAssignments[periodVenueAssignmentsKey]
    );
  }

  return {
    enrolledStudentIds: enrolledStudentIdSet,
    id: id,
    name: name,
    requiredNumberOfPeriods: requiredNumberOfPeriods,
    periodVenueAssignments: periodVenueAssignmentMap,
    assignedTeacherIds: assignedTeacherIdSet,
    subject: subject
  };
}
