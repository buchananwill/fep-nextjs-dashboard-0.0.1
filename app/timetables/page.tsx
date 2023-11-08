import React from 'react';

import { LessonCycleDTO, Period } from '../api/dto-interfaces';
import RightHandToolCard from '../components/right-hand-tool-card';
import BigTableCard from '../components/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../components/dynamic-dimension-timetable';
import {
  fetchAllLessonCycles,
  fetchAllPeriodsInCycle
} from '../api/request-schedule';
import { PeriodCardTransformer } from './period-card';
import { LessonCycle } from '../api/state-types';
import { index } from 'd3-array';
import TimetablesContextProvider from './timetables-context-provider';
import { TimetablesState } from './timetables-reducers';
import { FilterType } from '../electives/elective-filter-reducers';

function convertDtoToState({
  id,
  enrolledStudentIds,
  assignedTeacherIds,
  periodVenueAssignments,
  requiredNumberOfPeriods,
  name
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
    assignedTeacherIds: assignedTeacherIdSet
  };
}

export default async function TimetablesPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  const allLessonCycles = await fetchAllLessonCycles();

  const lessonCycleMap = new Map<number, LessonCycle>();

  allLessonCycles.forEach((lessonCycleDTO) => {
    const stateObject = convertDtoToState(lessonCycleDTO);
    lessonCycleMap.set(stateObject.id, stateObject);
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

  const initialState = buildTimetablesState(
    lessonCycleMap,
    periodToLessonCycleMap
  );

  return (
    <TimetablesContextProvider initialState={initialState}>
      <div className="flex w-full items-top justify-between pt-4  select-none">
        <BigTableCard>
          <DynamicDimensionTimetable<string, Period>
            tableContents={allPeriodsInCycle}
            cellDataTransformer={PeriodCardTransformer}
            headerTransformer={HeaderTransformerConcrete}
          ></DynamicDimensionTimetable>
        </BigTableCard>
        <RightHandToolCard>
          <RightHandToolCard.UpperSixth>
            Lesson Cycles
          </RightHandToolCard.UpperSixth>
          <RightHandToolCard.LowerFiveSixths>
            {allLessonCycles.map((lessonCycle, index) => (
              <p key={index}>{lessonCycle.name.substring(9)}</p>
            ))}
          </RightHandToolCard.LowerFiveSixths>
        </RightHandToolCard>
      </div>
    </TimetablesContextProvider>
  );
}

const HeaderTransformerConcrete: HeaderTransformer<string> = ({ data }) => {
  return <p className="w-24">{data}</p>;
};

export function buildTimetablesState(
  lessonCycleMap: Map<number, LessonCycle>,
  periodToLessonCycleMap: Map<number, Set<LessonCycle>>
): TimetablesState {
  return {
    highlightedCourses: new Set<string>(),
    pinnedLessonCycles: new Set<number>(),
    filterPending: false,
    filterType: FilterType.any,
    lessonCycleMap: lessonCycleMap,
    cycleDayFocusId: -1,
    periodFocusId: -1,
    periodIdToLessonCycleMap: periodToLessonCycleMap,
    partyId: -1
  };
}
