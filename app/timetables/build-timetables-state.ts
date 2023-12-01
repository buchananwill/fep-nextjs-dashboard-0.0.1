import { LessonCycle } from '../api/state-types';
import { TimetablesState } from './timetables-reducers';
import { FilterType } from '../electives/elective-filter-reducers';
import { LessonCycleDTO, Period, TabularDTO } from '../api/dto-interfaces';

export function buildTimetablesState(
  allPeriodsInCycle: TabularDTO<string, Period>,
  allLessonCycles: LessonCycleDTO[],
  scheduleId: number
): { initialState: TimetablesState; lessonCycleArray: LessonCycle[] } {
  const lessonCycleMap = new Map<number, LessonCycle>();

  const lessonCycleArray: LessonCycle[] = [];

  allLessonCycles.forEach((lessonCycleDTO) => {
    const stateObject = convertDtoToState(lessonCycleDTO);
    lessonCycleMap.set(stateObject.id, stateObject);
    lessonCycleArray.push(stateObject);
  });

  const periodToLessonCycleMap = new Map<number, Set<LessonCycle>>();

  allPeriodsInCycle.cellDataAndMetaData.forEach(
    ({ cellData: { periodId } }) => {
      if (periodId) {
        const stringOfId = periodId.toString();
        const setOfLessonCycles = new Set<LessonCycle>();
        allLessonCycles.forEach((dto) => {
          if (stringOfId in dto.periodVenueAssignments) {
            const retrievedCycle = lessonCycleMap.get(dto.id);
            if (retrievedCycle) setOfLessonCycles.add(retrievedCycle);
          }
        });
        periodToLessonCycleMap.set(periodId, setOfLessonCycles);
      }
    }
  );

  const initialState = {
    highlightedSubjects: new Set<string>(),
    pinnedLessonCycles: new Set<number>(),
    filterPending: false,
    filterType: FilterType.any,
    lessonCycleMap: lessonCycleMap,
    cycleDayFocusId: -1,
    focusPeriodId: -1,
    periodIdToLessonCycleMap: periodToLessonCycleMap,
    lessonCycleId: -1,
    scheduleId: scheduleId
  };

  return { initialState, lessonCycleArray };
}
function convertDtoToState({
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
